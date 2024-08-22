# Finance Manager

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v14.x or later)
- npm (v6.x or later) or yarn or pnpm or bun

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/arifsuz/finance-manager.git
    cd finance-manager
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

### Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Editing the Project

You can start editing the page by modifying [`pages/index.js`](command:_github.copilot.openSymbolInFile?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fworkspaces%2Ffinance-manager%2Fpages%2Findex.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pages%2Findex.js%22%5D "/workspaces/finance-manager/pages/index.js"). The page auto-updates as you edit the file.

### Database Integration with Supabase

This project uses Supabase for database integration. The configuration and client setup are handled in [`lib/supabaseClient.js`](command:_github.copilot.openSymbolInFile?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fworkspaces%2Ffinance-manager%2Flib%2FsupabaseClient.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22lib%2FsupabaseClient.js%22%5D "/workspaces/finance-manager/lib/supabaseClient.js").

#### Setting Up Supabase

1. Create a Supabase account and project at [supabase.com](https://supabase.com).
2. Obtain your Supabase URL and API Key from the project settings.

#### Configuring Supabase Client

Create a file named [`lib/supabaseClient.js`](command:_github.copilot.openSymbolInFile?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fworkspaces%2Ffinance-manager%2Flib%2FsupabaseClient.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22lib%2FsupabaseClient.js%22%5D "/workspaces/finance-manager/lib/supabaseClient.js") and add the following code:

```javascript
// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

Ensure you have the environment variables set in your [`.env.local`](command:_github.copilot.openSymbolInFile?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fworkspaces%2Ffinance-manager%2F.env.local%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22.env.local%22%5D "/workspaces/finance-manager/.env.local") file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_KEY=your-supabase-key
```

#### Using Supabase Client in API Routes

You can use the Supabase client in your API routes to interact with the database. For example, in [`pages/api/api.js`](command:_github.copilot.openSymbolFromReferences?%5B%22pages%2Fapi%2Fhello.js%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22external%22%3A%22file%3A%2F%2F%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22path%22%3A%22%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A47%2C%22character%22%3A46%7D%7D%5D%5D "Go to definition"):

```javascript
// pages/api/api.js
const handleUpdateTransaction = async () => {
  const { id, amount, type, description } = currentTransaction;

  // Update the transaction with the new data and current date
  const { data, error } = await supabase
    .from("transactions")
    .update({
      amount,
      type,
      description,
      created_at: new Date(), // Update the date to current date/time
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating transaction:", error);
  } else {
    setEditMode(false);
    setCurrentTransaction(null);
    fetchTransactions(); // Refresh the transaction list
  }
};
```

### Font Optimization

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Contributing

1. Fork the repository.
2. Create a new branch ([`git checkout -b feature-branch`](command:_github.copilot.openSymbolFromReferences?%5B%22git%20checkout%20-b%20feature-branch%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22external%22%3A%22file%3A%2F%2F%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22path%22%3A%22%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A122%2C%22character%22%3A30%7D%7D%5D%5D "Go to definition")).
3. Make your changes.
4. Commit your changes ([`git commit -m 'Add some feature'`](command:_github.copilot.openSymbolFromReferences?%5B%22git%20commit%20-m%20'Add%20some%20feature'%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22external%22%3A%22file%3A%2F%2F%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22path%22%3A%22%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A124%2C%22character%22%3A30%7D%7D%5D%5D "Go to definition")).
5. Push to the branch ([`git push origin feature-branch`](command:_github.copilot.openSymbolFromReferences?%5B%22git%20push%20origin%20feature-branch%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22external%22%3A%22file%3A%2F%2F%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22path%22%3A%22%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A122%2C%22character%22%3A42%7D%7D%5D%5D "Go to definition")).
6. Open a pull request.

## 👨‍💻 Authors
**Developed by :**
**Muhamad Nur Arif**

### 🔗 Link
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://arifsuz.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/arifsuz)
[![linkedin](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/marif8/)
[![instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/arif_suz/)
