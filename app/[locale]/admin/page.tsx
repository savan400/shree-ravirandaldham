import AdminForm from './AdminForm';

export default async function AdminPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return <AdminForm locale={locale} />;
}
