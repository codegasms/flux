# FLUX

A complete file management utility.

## Key Features


### Wide Range of supported File types

- Text
- PDFs
- Images
- Audio
- Videos

### File storage and In-browser file explorer

- Store your files on the backend server
- Image Viewer
- Document, text, pdf viewer
- Audio/video player
- See amount of storage used

### File Format Conversion

Convert between different formats of a file:

- Images: png <-> jpg <-> gif <-> Heic
- Videos: mp4 <-> mk4 <-> Heiv
- Text/Document: markdown <-> PDF

### File Compression

Compress your files to save storage space.

- Set default compression algorithm/level for all files in storage.
- One-off file compressor tool for Unauthorised users

### File Sharing

- Drag and drop a file, and instantly get a shareable link
- Share with "anyone access" or with specific users
- Role based sharing (Viewer/Editor/Transfer Owner)
- One off sharing (temporary storage) for Unauthorised users

### End-to-end encrypted secure access

- Files are encrypted on disk and in transit(HTTPS)
- Only the owner of the file, (or people having shared access permissions) can view the content

### In browser file editor

- General Features:
  - Format changer
  - Compressor
- Images: resize, crop, blur background, filters
- Videos: crop, change audio, blur a part, cut, resize,
  - Simple transitions
    - Fade in , Fade out
    - Cross Dissolve
    - Ripple Dissolve
    - and much more to come...
  - Rotate the video
  - Merge videos
  - Add Images and overlays
  - Add Text
  - Change speed of the video
- Text/PDF:
  - Edit content
  - Export to different formats,
  - Compress pdf
  - Merge pdf
  - Export markdown using some LaTeX template
  - Add watermark

### User management

- Multiple User roles supported in platform
  - Superadmin: The one who owns the server, can set storage quotas, and view metadata, can manage other users, configure backup policy
  - Admin: Cant manage other users, but can perform mantainance and view paltform analytics
  - Staff: Has granular permissions as given by superadmin
  - User: Normal enduser, who can access their own files
  - Unregistered user: Anyone who hasn't created an account on the website and is just visiting. Gets basic functionality and restricted access to features.Pricing and Payment Gateway Integration

- User Account and security
  - Login with Google, GitHub, Twitter, LinkedIn
  - Login with email and password
  - Safe Password recovery mechanism


### Pricing and Payment Gateway Integration

- The superadmin can set pricing for different storage and compute quotas
- Users can easily pay and get access

## Outcomes/Goals

### UI/UX

- Build a very intuitive and responsive home page to enchant any user that visits our web interface.
- Learn UI/UX to design a smooth and easy to use platform
- A/B Testing to make enhanced decisions based on user feedback
- Inclusivity and Accessibility
- Tooltips and Guided tools for accessibility

### Algorithm Design

- Learning and implementing image and video manipulation

- Understand different file encoding mechanisms
- Learn and implement file compression algorithms

- Learn and implement file encryption algorithms

### Adhere To Software Design Best Practices

- **YAGNI (You Ain't Gonna Need It):** Avoid code for potential future use; prioritize current requirements and design extensible APIs.
- **Test Infrastructure, not External Code:** Focus on testing your code over external libraries; ensure infrastructure, frameworks, and testing libraries are well-tested.
- **Extract Repeated Code After Third Use:** Create general-purpose helpers after the third occurrence of similar code; test them when reused elsewhere.
- **API Design: Simple Things First, Complex Things Possible:** Design external and object APIs for simplicity; add options for complexity as needed.
- **Fail Fast:** Check input validity early, providing clear error responses; allow innovative use cases but avoid unnecessary type checking.
- **Unit Testing Principles:** Test behavior, not implementation details; treat test objects as black boxes; consider writing tests first for modular code.
- **Aim for 100% Code Coverage:** Ensure unit tests cover all code paths; lack of time is not an excuse; measure and reject PRs reducing coverage.
- **Code is the Enemy:** Write less, delete unnecessary code; prioritize simplicity and readability.
- **Be Cautious with Comments:** Prioritize self-documenting code; if necessary, focus on explaining intent rather than detailing code actions.
- **Write Defensively:** Consider potential issues, invalid input, and failure scenarios; catch bugs early by anticipating problems.

### API Design

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

### Database Design

- Implement a mechanism to store files on disk and their metadata on DB
- Design an efficient schema and indexes, such that DB access has least possible latency
- Analyze access patterns and optimize schema and implement indexes for improved response times

### Reliability Engineering

- Implement suitable caching for fast service
- Implement server backup scripts
- Implement unit tests and e2e tests

### Security Engineering

- Implement Rate Limiting(prevent DDoS)
- Incorrect password attempt throttling for Security

## Roadmap

### February

- Make the figma designs for the web interface
- Decide code structure and flow.
- Implement a generic user management system supporting registrations, logins, roles and permissions.
- Start making the basic structure of the web interface along with the frontend components using CSS.
- Complete the entire design of the web interface and make the full webapp (Just the basic structure with the designs implemented, no functionality implemented).
- Work on the first iteration of the database schema of our service.

### March

- Work on the core algorithms of the service.
  - File compression algorithms
  - File conversion algorithms
  - Algorithms for Image and Video editing
  - Algorithms for audio

- Complete implementing all the planned API endpoints.
- Finalize the database schema of the service and deploy it on a service.
- Start writing unit tests and integration tests.
- Deploy and Release the prototype to friends and professors for testing
- Rapidly iterate and imporove on user feedback.
- CI/CD

### April

- Focus on polishing the interface...
- Optimize our database schema and indices based on access patterns.
- Refactor code for better readability and maintainability.
- Implement backup and recovery systems
- Write loadtesting scripts to assess the unit economic of the server
- Get code reviews from seniors and professors

## Team

- Saurabh Pal
- Bishwajeet Sahoo
- Suvan Sarkar
- Vinayak Anand
- Aahnik Daw

### Collaboration

- Every member of the team will collaborate via GitHub Pull Requests and Issues
- Every member will explore full stack development and contribute in both frontend and backend

### Individual Contribution

Each of the 5 team members will lead a certain dimension of the Project.

#### Aahnik Daw

- CI/CD (Continuous Integration and Continuous development)
- Design API endpoints
- Database schema design
- Load testing

#### Saurabh Pal

- Work on the algorithms for file compression
- Work on the algorithms for image/video manipulation.
- Code organisation and code design.

#### Bishwajeet Sahoo

- Work on the initial web interface design on figma
- Make the interface exciting by integrating animations and textures.

#### Suvan Sarkar

- Work on the designs innovated by Bishwajeet. Main techstack includes the CSS files for the website.
- Make the user interface responsive and enticing.

#### Vinayak Anand

- Implement designs from figma files
- Write unit tests and e2e tests