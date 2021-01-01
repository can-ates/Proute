## Proute
Project Management System

## Models

-----User-----
    name: string
    email: string
    photoURL: string
    projects: ref(Project)
    

-----Project-----
    author: ref(User)
    contributors: ref(User)
    title: string
    description: string
    tags: string[]
    status: default(in progress)
    tasks: [
        priority: string
        todo: string
        assigned: ref(User)
        createdAt: Date
        tags: []
        status: default(in progress)
    ]
    comments: [
        author: ref(User)
        comment: string
        createdAt: Date
    ]
    createdAt: Date
    dueDate: Date

## Authentication

    Email-Password
    OAuth

## Tech/framework will be used

<b>Initial Setup</b>
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [SWR](https://swr.vercel.app/)
- [Material UI](https://material-ui.com/)
- [Redux](https://redux.js.org/)
- [Node.js](https://nodejs.org/en/)
- [GraphQL](https://graphql.org/)
- [MongoDB](https://www.mongodb.com/2)

