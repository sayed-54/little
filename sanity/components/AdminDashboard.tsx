"use client";
import { useEffect, useState } from 'react';
import { useClient } from 'sanity';
import { Card, Text, Flex, Heading, Label, Stack, Box, Grid } from '@sanity/ui';

export default function AdminDashboard() {
  const client = useClient({ apiVersion: '2022-03-07' });
  const [metrics, setMetrics] = useState({ 
    totalRevenue: 0, 
    totalOrders: 0, 
    pendingOrders: 0,
    lowStockProducts: [] as any[]
  });

  useEffect(() => {
    async function fetchMetrics() {
      const ordersQuery = `*[_type == "order"] { totalPrice, status }`;
      const lowStockQuery = `*[_type == "products" && stock < 10] { _id, name, stock }`;
      
      const [orders, lowStock] = await Promise.all([
        client.fetch(ordersQuery),
        client.fetch(lowStockQuery)
      ]);

      setMetrics({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0),
        pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
        lowStockProducts: lowStock
      });
    }

    fetchMetrics();
  }, [client]);

  return (
    <Box padding={5}>
      <Stack space={5}>
        <Heading as="h1" size={4}>Store Overview</Heading>
        <Text muted>Real-time analytics for your e-commerce operations</Text>
        
        <Grid columns={[1, 1, 3]} gap={4} marginTop={4}>
          <Card padding={4} radius={2} shadow={1} tone="primary">
            <Stack space={3}>
              <Label>Total Revenue</Label>
              <Heading size={5}>EGP {metrics.totalRevenue.toLocaleString()}</Heading>
            </Stack>
          </Card>
          
          <Card padding={4} radius={2} shadow={1} tone="positive">
            <Stack space={3}>
              <Label>Total Orders</Label>
              <Heading size={5}>{metrics.totalOrders}</Heading>
              <Text size={1} muted>{metrics.pendingOrders} pending</Text>
            </Stack>
          </Card>

          <Card padding={4} radius={2} shadow={1} tone="critical">
            <Stack space={3}>
              <Label>Low Stock Items</Label>
              <Heading size={5}>{metrics.lowStockProducts.length}</Heading>
            </Stack>
          </Card>
        </Grid>

        {metrics.lowStockProducts.length > 0 && (
          <Box marginTop={5}>
            <Box marginBottom={4}>
              <Heading as="h2" size={3}>Action Required: Low Stock</Heading>
            </Box>
            <Stack space={3}>
              {metrics.lowStockProducts.map((p) => (
                <Card key={p._id} padding={3} radius={2} shadow={0} border>
                  <Flex justify="space-between" align="center">
                    <Text weight="semibold">{p.name}</Text>
                    <div style={{ color: 'red' }}>
                      <Text>{p.stock} remaining</Text>
                    </div>
                  </Flex>
                </Card>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
