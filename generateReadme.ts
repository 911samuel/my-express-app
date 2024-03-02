import * as fs from 'fs';

const readmeContent = `
# Your Project Name

## Description
Describe your project here.

## Installation
Provide installation instructions here.

## Usage
Provide usage instructions here.

## Contributing
Provide guidelines for contributing to your project.

## License
Specify the license for your project.

## Authors
List the authors/contributors of your project.
`;

fs.writeFile('README.md', readmeContent, (err: NodeJS.ErrnoException | null) => {
    if (err) throw err;
    console.log('README.md created successfully.');
});
