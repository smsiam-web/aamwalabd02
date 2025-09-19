// lib/pathao.ts
export async function getPathaoToken() {
    const url = `${process.env.PATHAO_BASE_URL}/aladdin/api/v1/issue-token`;
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.PATHAO_CLIENT_ID,
        client_secret: process.env.PATHAO_CLIENT_SECRET,
        grant_type: 'password',
        username: process.env.PATHAO_USERNAME,
        password: process.env.PATHAO_PASSWORD,
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      console.error('Pathao token error:', data);
      throw new Error(data?.message || 'Failed to fetch Pathao token');
    }
  
    console.log('✅ Pathao Token:', data.access_token);
    return data.access_token;
  }

  export async function createPathaoOrder(orderData: any) {
    const token = await getPathaoToken();

    console.log(token)
  
    const res = await fetch(`${process.env.PATHAO_BASE_URL}/aladdin/api/v1/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Order placement failed');
    return data;
  }
  
  