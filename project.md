# flux

A complete file management utility.

## Key Features


### Wide Range of supported File types

- Text
- PDFs
- Images
- Videos

### File storage and In-browser file explorer

- store your files on server
- see amount of storage used

### File Format Conversion

Convert between different formats of a file. For example jpeg to png for image files etc.

### File Compression

Compress your files to save storage space.

### File Sharing

- Drag and drop a file, and instantly get a shareable link
- Share with "anyone access" or with specific users
- Role based sharing (Viewer/Editor)

### End-to-end encrypted secure access

- Files are encrypted on disk and in transit(HTTPS)
- Only the owner of the file, (or people having shared access permissions) can view the content

### In browser file editor

- Images: resize, crop, blur background
- Videos: crop, change audio, blur a part
- Text/PDF: edit content, export to different formats

### Multiple User roles of platform

- superadmin: the one who owns the server, can set storage quotas, and view metadata, can manage other users, configure backup policy
- admin: cant manage other users, but can perform mantainance and view paltform analytics
- staff: has granular permissions as given by superadmin
- user: normal enduser, who can access their own files

Only the user who is owner of the file, can view/edit it. No one else can. If an user exceeds their storage quota, the superadmin may decide to delete the users files.

### Pricing and Payment Gateway Integration

- The superadmin can set pricing for different storage and compute quotas
- users can easily pay and get access

## Project Goals

- Understand different file encoding mechanisms
- Learn and implement file compression algorithms
- Learn and implement file encryption algorithms
- Implement custom state management solution for building complex ui, with pure JS
- Learn UI/UX to design a smooth and easy to use platform
- Implement a mechanism to store files on disk and their metadata on DB
- Design an efficient schema and indexes, such that DB access has least possible latency
- Implement suitable caching for fast service
- Implement server backup scripts, and
