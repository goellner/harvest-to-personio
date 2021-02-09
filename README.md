# Harvest to Personio converter

Super basic next.js app, which fetches your [Harvest](https://www.getharvest.com/) time entries and shows you what you have to enter in [Personio](https://www.personio.de/).

## Why

Because the time tracker menubar app from Harvest ist just perfect and I wanted an easy way to get the data of the week to enter in Personio.
## Getting Started

Get the following from your Harvest Account:

- Personal Acccess Token: https://id.getharvest.com/developers
- Your Harvest User Id
- Your Client ID (this project only uses one client, as it is most likely the company you work at)

Copy the `.env.example` and fill in your credentials.

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/weekTimes](http://localhost:3000/api/weekTimes). This endpoint can be edited in `pages/api/weekTimes.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Bugs

This is custom tailored to my needs and I guess it has bugs. Time stuff is always weird.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
