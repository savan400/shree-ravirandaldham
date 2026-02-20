import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  let messages;
  try {
    messages = await getMessages({ locale: 'en' });
  } catch (error) {
    notFound();
  }

  return (
    <html lang="en">
      <body className="antialiased">
        <NextIntlClientProvider locale="en" messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
