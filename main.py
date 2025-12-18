"""
LeetCode Top Interview 150 Visualizer
FastAPI application to visualize and explore LeetCode problems
"""

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import json
import subprocess
import sys
import tempfile
import traceback
import os
from pathlib import Path

app = FastAPI(title="LeetCode Top Interview 150 Visualizer")

# Setup paths
BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "problems.json"
SOLUTIONS_FILE = BASE_DIR / "data" / "solutions.json"

# Mount static files
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

# Templates
templates = Jinja2Templates(directory=BASE_DIR / "templates")


class CodeSubmission(BaseModel):
    code: str
    slug: str


def load_problems():
    """Load problems from JSON file"""
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def load_solutions():
    """Load solutions from JSON file"""
    with open(SOLUTIONS_FILE, "r") as f:
        return json.load(f)


def get_stats(data):
    """Calculate statistics from problem data"""
    total = 0
    easy = 0
    medium = 0
    hard = 0
    category_stats = []

    for category in data["categories"]:
        cat_easy = sum(1 for p in category["problems"] if p["difficulty"] == "Easy")
        cat_medium = sum(1 for p in category["problems"] if p["difficulty"] == "Medium")
        cat_hard = sum(1 for p in category["problems"] if p["difficulty"] == "Hard")
        cat_total = len(category["problems"])

        category_stats.append({
            "name": category["name"],
            "icon": category["icon"],
            "total": cat_total,
            "easy": cat_easy,
            "medium": cat_medium,
            "hard": cat_hard
        })

        total += cat_total
        easy += cat_easy
        medium += cat_medium
        hard += cat_hard

    return {
        "total": total,
        "easy": easy,
        "medium": medium,
        "hard": hard,
        "categories": category_stats
    }


def title_to_slug(title):
    """Convert problem title to URL slug"""
    return title.lower().replace(" ", "-").replace("(", "").replace(")", "").replace(",", "")


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Serve main dashboard"""
    data = load_problems()
    solutions = load_solutions()
    stats = get_stats(data)
    
    # Add slug to each problem for solution lookup
    for category in data["categories"]:
        for problem in category["problems"]:
            slug = title_to_slug(problem["title"])
            problem["slug"] = slug
            problem["has_solution"] = slug in solutions.get("solutions", {})
    
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "categories": data["categories"],
            "stats": stats,
            "solutions": solutions.get("solutions", {})
        }
    )


@app.get("/api/problems")
async def get_problems():
    """Return all problems as JSON with slugs"""
    data = load_problems()
    solutions = load_solutions()
    
    # Enrich with slug and solution status
    for category in data["categories"]:
        for problem in category["problems"]:
            slug = title_to_slug(problem["title"])
            problem["slug"] = slug
            problem["has_solution"] = slug in solutions.get("solutions", {})
            
    return data


@app.get("/api/stats")
async def get_statistics():
    """Return aggregate statistics"""
    data = load_problems()
    return get_stats(data)


@app.get("/api/categories")
async def get_categories():
    """Return category breakdown"""
    data = load_problems()
    return {"categories": [cat["name"] for cat in data["categories"]]}


@app.get("/api/solutions")
async def get_all_solutions():
    """Return all solutions"""
    return load_solutions()


@app.get("/api/solutions/{slug}")
async def get_solution(slug: str):
    """Return a specific solution by slug"""
    solutions = load_solutions()
    if slug in solutions.get("solutions", {}):
        return solutions["solutions"][slug]
    return {"error": "Solution not found"}


@app.post("/api/run")
async def run_code(submission: CodeSubmission):
    solutions = load_solutions()
    
    # Check if solution exists, if not, we can still run if problem exists but need test cases
    # For now, require solution to exist (or we could fetch from problem desc if we had it)
    if submission.slug not in solutions.get("solutions", {}):
        return {"error": "Solution not found", "success": False}
    
    solution_data = solutions["solutions"][submission.slug]
    test_cases = solution_data.get("testCases", [])
    
    if not test_cases:
        return {"error": "No test cases available for this problem", "success": False}
    
    # Use shared runner
    from runner import execute_code
    return execute_code(submission.code, test_cases)

class GenerateRequest(BaseModel):
    slug: str

@app.post("/api/generate")
async def generate_solution_endpoint(request: GenerateRequest):
    # 1. Check if already exists
    solutions = load_solutions()
    if request.slug in solutions.get("solutions", {}):
         return {"success": True, "slug": request.slug, "cached": True}
         
    # 2. Get Problem Details
    problems = load_problems()
    problem = None
    for cat in problems["categories"]:
        for p in cat["problems"]:
             if title_to_slug(p["title"]) == request.slug:
                 problem = p
                 break
    if not problem:
        return {"success": False, "error": "Problem not found"}
        
    # 3. Call AI Engine
    from ai_engine import generate_solution_json, validate_and_fix
    
    # We need a description? We only have title + URL. 
    # Ideally we'd scrape the URL or use a stored description.
    # For now, pass title and hope AI knows it (Top 150 are famous)
    solution_data = generate_solution_json(problem["title"], f"LeetCode problem {problem['title']}")
    
    if "error" in solution_data:
         return {"success": False, "error": solution_data["error"]}
         
    # 4. Validate
    solution_data, passed = validate_and_fix(solution_data, request.slug)
    
    # 5. Save even if validation failed (so user can edit it), but mark it?
    # Or maybe only save if valid? Let's save it but add a flag?
    # For now, just save it.
    solution_data["generated"] = True
    solution_data["validationPassed"] = passed
    
    # Add title
    solution_data["title"] = problem["title"]
    
    solutions["solutions"][request.slug] = solution_data
    
    with open(SOLUTIONS_FILE, "w") as f:
        json.dump(solutions, f, indent=4)
        
    return {"success": True, "slug": request.slug, "passed": passed}

