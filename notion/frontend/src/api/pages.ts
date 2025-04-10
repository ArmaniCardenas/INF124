export async function fetchPage(id: string) {
    const response = await fetch(`http://localhost:3000/pages/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch page');
    }
    return response.json();
  }
  
  export async function createPage(pageData: any) {
    const response = await fetch(`http://localhost:3000/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pageData),
    });
    if (!response.ok) {
      throw new Error('Failed to create page');
    }
    return response.json();
  }
  