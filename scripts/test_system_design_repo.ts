
import { FileSystemDesignRepository } from '../src/adapters/driven/fs/FileSystemDesignRepository';
import path from 'path';

async function testRepo() {
    console.log("Testing FileSystemDesignRepository...");
    console.log("CWD:", process.cwd());
    
    // Create instance
    const repo = new FileSystemDesignRepository();
    
    console.log("\n--- Testing Topics ---");
    const topics = await repo.getTopics();
    console.log(`Topics found: ${topics.length}`);
    if (topics.length > 0) {
        console.log("First topic:", topics[0].title);
    } else {
        console.error("❌ No topics found!");
    }

    console.log("\n--- Testing Problems ---");
    const problems = await repo.getProblems();
    console.log(`Problems found: ${problems.length}`);
    if (problems.length > 0) {
        console.log("First problem:", problems[0].title);
    } else {
        console.error("❌ No problems found!");
    }

    console.log("\n--- Testing Solutions ---");
    // Pick a slug if we have problems, or a known one
    const slug = problems.length > 0 ? problems[0].slug : 'tinyurl';
    const solution = await repo.getSolution(slug);
    if (solution) {
        console.log(`✅ Solution found for '${slug}'`);
    } else {
        console.log(`❌ Solution not found for '${slug}'`);
    }
}

testRepo().catch(console.error);
