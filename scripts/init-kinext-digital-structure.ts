/**
  * File: init-kinext-digital-structure.ts
  * Purpose: Creates the directory structure and placeholder files for the Kinext Digital project.
  * File Structure:
  *  - Imports
  *  - Constants
  *  - Helper Function: createDirectory
  *  - Helper Function: createFile
  *  - Main Function: createProjectStructure
  *  - Script Execution
  * Function Comments: Each function includes detailed JSDoc comments.
  * Class Comments: N/A (no classes)
  */

import * as fs from 'fs';
import * as path from 'path';

// --- Constants ---
const PROJECT_ROOT = process.cwd(); // Assumes the script is run from the project root

// --- Helper Functions ---

/**
 * Creates a directory if it doesn't already exist.
 * @param dirPath The path to the directory.
 */
function createDirectory(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); // recursive: true creates parent directories if needed
        console.log(`Created directory: ${dirPath}`);
    }
}

/**
 * Creates a file if it doesn't already exist.
 * @param filePath The path to the file.
 * @param content The content of the file (optional).
 */
function createFile(filePath: string, content: string = '') {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
        console.log(`Created file: ${filePath}`);
    }
}

// --- Main Function ---

/**
 * Creates the project structure and placeholder files.
 */
function createProjectStructure() {
    console.log(PROJECT_ROOT);
    // --- Create Directories ---

    // src/app/
    createDirectory(path.join(PROJECT_ROOT, 'src', 'app', 'api', 'auth', '[...nextauth]'));
    createDirectory(path.join(PROJECT_ROOT, 'src', 'app', 'cms', '[slug]'));
    createDirectory(path.join(PROJECT_ROOT, 'src', 'app', 'crm'));
    createDirectory(path.join(PROJECT_ROOT, 'src', 'app', 'careers'));
    createDirectory(path.join(PROJECT_ROOT, 'src', 'app', 'webhooks'));
    createDirectory(path.join(PROJECT_ROOT, 'src', 'app', '_components'));

    // src/components/
    createDirectory(path.join(PROJECT_ROOT, 'src', 'components', 'ui'));
    createDirectory(path.join(PROJECT_ROOT, 'src', 'components', 'cms'));
    createDirectory(path.join(PROJECT_ROOT, 'src', 'components', 'crm'));
    createDirectory(path.join(PROJECT_ROOT, 'src', 'components', 'careers'));
    createDirectory(path.join(PROJECT_ROOT, 'src', 'components', 'layout'));

    // src/lib/
    createDirectory(path.join(PROJECT_ROOT, 'src', 'lib'));

    // src/types/
    createDirectory(path.join(PROJECT_ROOT, 'src', 'types'));

    // src/providers
    createDirectory(path.join(PROJECT_ROOT, 'src', 'providers'));

    // src/stores
    createDirectory(path.join(PROJECT_ROOT, 'src', 'stores'));

    // src/styles/
    createDirectory(path.join(PROJECT_ROOT, 'src', 'styles'));


    // --- Create Files ---

    // src/app/
    createFile(path.join(PROJECT_ROOT, 'src', 'app', 'api', 'auth', '[...nextauth]', 'route.ts'), '// NextAuth.js route handler');
    createFile(path.join(PROJECT_ROOT, 'src', 'app', 'cms', '[slug]', 'route.ts'), '// Dynamic route for CMS content');
    createFile(path.join(PROJECT_ROOT, 'src', 'app', 'globals.css'), '/* Global styles */');
    createFile(path.join(PROJECT_ROOT, 'src', 'app', 'layout.tsx'), '// App layout');
    createFile(path.join(PROJECT_ROOT, 'src', 'app', 'page.tsx'), '// Homepage');

    // src/components/ui/
    createFile(path.join(PROJECT_ROOT, 'src', 'components', 'ui', 'Button.tsx'), '// Mantine Button component');
    createFile(path.join(PROJECT_ROOT, 'src', 'components', 'ui', 'Input.tsx'), '// Mantine Input component');
    createFile(path.join(PROJECT_ROOT, 'src', 'components', 'ui', 'Select.tsx'), '// Mantine Select component');
    createFile(path.join(PROJECT_ROOT, 'src', 'components', 'ui', 'index.ts'), '// Barrel file for UI components');

    // src/components/cms/
    createFile(path.join(PROJECT_ROOT, 'src', 'components', 'cms', 'ContentEditor.tsx'), '// CMS Content Editor component');
    createFile(path.join(PROJECT_ROOT, 'src', 'components', 'cms', 'ContentRenderer.tsx'), '// CMS Content Renderer component');
    createFile(path.join(PROJECT_ROOT, 'src', 'components', 'cms', 'index.ts'), '// Barrel file for CMS components');

    // src/components/crm/
    createFile(path.join(PROJECT_ROOT, 'src', 'components', 'crm', 'ContactForm.tsx'), '// CRM Contact Form component');
    createFile(path.join(PROJECT_ROOT, 'src', 'components', 'crm', 'ContactList.tsx'), '// CRM Contact List component');
    createFile(path.join(PROJECT_ROOT, 'src', 'components', 'crm', 'index.ts'), '// Barrel file for CRM components');

    // src/components/careers/
    createFile(path.join(PROJECT_ROOT, 'src', 'components', 'careers', 'JobListing.tsx'), '// Career Portal Job Listing component');
    createFile(path.join(PROJECT_ROOT, 'src', 'components', 'careers', 'JobApplicationForm.tsx'), '// Career Portal Job Application Form component');
    createFile(path.join(PROJECT_ROOT, 'src', 'components', 'careers', 'index.ts'), '// Barrel file for Career Portal components');

    // src/components/layout/
    createFile(path.join(PROJECT_ROOT, 'src', 'components', 'layout', 'Header.tsx'), '// Header component');
    createFile(path.join(PROJECT_ROOT, 'src', 'components', 'layout', 'Footer.tsx'), '// Footer component');
    createFile(path.join(PROJECT_ROOT, 'src', 'components', 'layout', 'index.ts'), '// Barrel file for layout components');
    createFile(path.join(PROJECT_ROOT, 'src', 'components', 'index.ts'), '// Barrel file for all components');

    // src/lib/
    createFile(path.join(PROJECT_ROOT, 'src', 'lib', 'auth.ts'), '// NextAuth.js configuration');
    createFile(path.join(PROJECT_ROOT, 'src', 'lib', 'db.ts'), '// Database connection and utility functions');
    createFile(path.join(PROJECT_ROOT, 'src', 'lib', 'utils.ts'), '// General utility functions');
    createFile(path.join(PROJECT_ROOT, 'src', 'lib', 'api.ts'), '// Helper functions for API calls');

    // src/types/
    createFile(path.join(PROJECT_ROOT, 'src', 'types', 'cms.ts'), '// TypeScript types for CMS');
    createFile(path.join(PROJECT_ROOT, 'src', 'types', 'crm.ts'), '// TypeScript types for CRM');
    createFile(path.join(PROJECT_ROOT, 'src', 'types', 'careers.ts'), '// TypeScript types for Career Portal');
    createFile(path.join(PROJECT_ROOT, 'src', 'types', 'index.ts'), '// Barrel file for types');

    // src/providers
    createFile(path.join(PROJECT_ROOT, 'src', 'providers', 'MantineProvider.tsx'), '// Mantine Provider');

    // src/stores/
    createFile(path.join(PROJECT_ROOT, 'src', 'stores', 'cmsStore.ts'), '// Zustand store for CMS');
    createFile(path.join(PROJECT_ROOT, 'src', 'stores', 'crmStore.ts'), '// Zustand store for CRM');
    createFile(path.join(PROJECT_ROOT, 'src', 'stores', 'careersStore.ts'), '// Zustand store for Career Portal');
    createFile(path.join(PROJECT_ROOT, 'src', 'stores', 'index.ts'), '// Barrel file for stores');

    // src/styles/
    createFile(path.join(PROJECT_ROOT, 'src', 'styles', 'globals.css'), '/* Global styles */');
}

// --- Script Execution ---

console.log('Creating project structure...');
createProjectStructure();
console.log('Project structure created successfully!');