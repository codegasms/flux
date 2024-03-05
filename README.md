# FLUX - File Management Utility

A comprehensive file management utility designed for efficient storage, seamless file exploration, and versatile file manipulation.

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Software Practices](#software-practices)
- [Algorithm Design](#algorithm-design)
- [API Design](#api-design)
- [Database Design](#database-design)
- [Reliability & Security](#reliability--security)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Key Features

- **Wide Range of Supported File Types:**
  - Text
  - PDFs
  - Images
  - Audio
  - Videos

- **File Storage and In-Browser File Explorer:**
  - Store files on the backend server
  - Image Viewer, Document, Text, PDF Viewer
  - Audio/Video Player
  - Storage Usage Display

- **File Format Conversion:**
  - Convert between different formats
  - Images: png ↔ jpg ↔ gif ↔ Heic
  - Videos: mp4 ↔ mk4 ↔ Heiv
  - Text/Document: markdown ↔ PDF

- **File Compression:**
  - Compress files to save storage space
  - Set default compression algorithm/level
  - One-off file compressor tool for unauthorized users

- **File Sharing:**
  - Drag and drop for instant shareable link
  - Role-based sharing (Viewer/Editor/Transfer Owner)
  - One-off sharing for unauthorized users

- **End-to-End Encrypted Secure Access:**
  - Files encrypted on disk and in transit (HTTPS)
  - Owner or shared access for content viewing

- **In-Browser File Editor:**
  - General Features: Format changer, Compressor
  - Images: resize, crop, blur, filters
  - Videos: crop, audio change, blur, cut, resize, transitions, rotate, merge, overlays, text, speed change
  - Text/PDF: Edit, export, compress, merge, export markdown with LaTeX template, watermark

- **User Management:**
  - Multiple User Roles: Superadmin, Admin, Staff, User, Unregistered User
  - Account and Security: Login with Google, GitHub, Twitter, LinkedIn; Email and password login; Password recovery mechanism

- **Pricing and Payment Gateway Integration:**
  - Set pricing for storage and compute quotas
  - Multiple pricing tiers
  - Easy payment for more features

## Tech Stack

- HTML5
- CSS3 (Tailwind CSS)
- Javascript
- ejs
- Expressjs
- Nodejs
- MongoDB
- More to be added later

![tech_stack.png](./docs/tech_stack.png)

## Software Practices

- YAGNI: Avoid code for potential future use; prioritize current requirements and design extensible APIs.
- Test Infrastructure, not External Code: Focus on testing your code over external libraries; ensure infrastructure, frameworks, and testing libraries are well-tested.
- Extract Repeated Code After Third Use: Create general-purpose helpers after the third occurrence of similar code; test them when reused elsewhere.
- API Design: Simple Things First, Complex Things Possible: Design external and object APIs for simplicity; add options for complexity as needed.
- Fail Fast: Check input validity early, providing clear error responses; allow innovative use cases but avoid unnecessary type checking.
- Unit Testing Principles: Test behavior, not implementation details; treat test objects as black boxes; consider writing tests first for modular code.
- Aim for 100% Code Coverage: Ensure unit tests cover all code paths; lack of time is not an excuse; measure and reject PRs reducing coverage.
- Code is the Enemy: Write less, delete unnecessary code; prioritize simplicity and readability.
- Be Cautious with Comments: Prioritize self-documenting code; if necessary, focus on explaining intent rather than detailing code actions.
- Write Defensively: Consider potential issues, invalid input, and failure scenarios; catch bugs early by anticipating problems.

## Algorithm Design

- Learning and implementing image and video manipulation
- Understand different file encoding mechanisms
- Learn and implement file compression algorithms
- Learn and implement file encryption algorithms

- [ ] To Be Added Later

## API Design

- Design the API with good RESTfull api practices
- Accept and respond with JSON
- Use nouns instead of verbs in endpoint paths
- Name collections with plural nouns
- Nesting resources for hierarchical objects
- Handle errors gracefully and return standard error codes
- Allow filtering, sorting, and pagination
- Maintain Good Security Practices
- Cache data to improve performance
- Versioning our APIs

- [ ] More To Be Added Later

## Database Design

- Implement a mechanism to store files on disk and their metadata on DB
- Design an efficient schema and indexes, such that DB access has least possible latency
- Analyze access patterns and optimize schema and implement indexes for improved response times

- [ ] To Be Added Later

## Reliability & Security

- Implement suitable caching for fast service
- Implement server backup scripts
- Implement unit tests and e2e tests
- Implement Rate Limiting(prevent DDoS)
- Incorrect password attempt throttling for Security

- [ ] To Be Added Later

## Usage

- [ ] To Be Added Later

## Contributing

- TBD & Added Later

## License

This project is licensed under the {-------} license - see the [LICENSE.md](LICENSE.md) file for details.
