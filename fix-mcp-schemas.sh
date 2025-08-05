#!/bin/bash

# Fix tools.ts - replace z.object() with raw shapes
echo "Fixing src/tools.ts..."
cp src/tools.ts src/tools.ts.backup

# For empty schemas
sed -i '' 's/inputSchema: z\.object({})/inputSchema: {}/g' src/tools.ts

# For ApplicationCreateSchema and similar
sed -i '' 's/inputSchema: ApplicationCreateSchema$/inputSchema: ApplicationCreateSchema.shape/g' src/tools.ts
sed -i '' 's/inputSchema: DatabaseCreateSchema$/inputSchema: DatabaseCreateSchema.shape/g' src/tools.ts
sed -i '' 's/inputSchema: ServiceCreateSchema$/inputSchema: ServiceCreateSchema.shape/g' src/tools.ts
sed -i '' 's/inputSchema: ServerCreateSchema$/inputSchema: ServerCreateSchema.shape/g' src/tools.ts
sed -i '' 's/inputSchema: ProjectCreateSchema$/inputSchema: ProjectCreateSchema.shape/g' src/tools.ts

echo "Tools.ts fixed!"

# Fix prompts.ts
echo "Fixing src/prompts.ts..."
cp src/prompts.ts src/prompts.ts.backup

# We need to be more careful with prompts.ts
# Let's use a different approach - just comment out the problematic lines for now

echo "Prompts.ts will need manual fixing"

echo "Done! Now rebuild with npm run build"