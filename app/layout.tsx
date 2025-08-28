import './globals.css'; // global styles
import Navbar from '../components/navbar';

export const metadata = {
  title: 'My Website',
  description: 'A Next.js app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
            <Navbar />

        {children}
      </body>
    </html>
  );
}
