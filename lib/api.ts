const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchSeoData(route: string, locale: string) {
  try {
    const res = await fetch(`${API_URL}/seo?route=${route}&locale=${locale}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch SEO data');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return null;
  }
}

export async function saveSeoData(data: any) {
    try {
        const res = await fetch(`${API_URL}/admin/seo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error('Failed to save SEO data');
        }

        return res.json();
    } catch (error) {
        console.error('Error saving SEO data:', error);
        throw error;
    }
}
