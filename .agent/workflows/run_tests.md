# Run Tests and Validation

---
description: How to run tests and validate solutions
---

To ensure the integrity of the platform and its solutions, run the following tests:

1. **Solution Validation**: Run `make test` or `python3 validate_all.py` to validate all 252+ LeetCode solutions.
2. **Frontend Build**: Run `cd frontend && npm run build` to verify the React application builds without errors.
3. **Backend Type Check**: Run `cd api && npx tsc` to ensure the TypeScript backend is type-safe.
4. **Data Audit**: Run `node scripts/validate-all-data.js` to perform a comprehensive audit of the problem and solution datasets.
