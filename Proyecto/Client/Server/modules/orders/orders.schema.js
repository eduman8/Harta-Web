const ensureOrderSchema = async (pool) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        total NUMERIC(10,2) NOT NULL DEFAULT 0,
        status VARCHAR(30) NOT NULL DEFAULT 'pending',
        shipping_method VARCHAR(30),
    shipping_cost NUMERIC(10,2) DEFAULT 0,
    shipping_address JSONB,
    payment_method VARCHAR(30),
    payment_reference VARCHAR(255),
    contact_name VARCHAR(255),
    contact_phone VARCHAR(80),
    shipping_reference TEXT,
    paid_at TIMESTAMP,
    mp_preference_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
`);
    await pool.query(`
  CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
    
  );
`);
    await pool.query(`
  ALTER TABLE order_items
  ALTER COLUMN product_name DROP NOT NULL;
`);
    await pool.query(`
  ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10,2) NOT NULL DEFAULT 0;
`);
    await pool.query(`
  CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
`);

    await pool.query(`
  CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
`);
    await pool.query(`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS shipping_method VARCHAR(30),
      ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS shipping_address JSONB,
      ADD COLUMN IF NOT EXISTS payment_method VARCHAR(30),
      ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(255),
      ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(80),
      ADD COLUMN IF NOT EXISTS shipping_reference TEXT,
      ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS mp_preference_id VARCHAR(255);
    `);
  } catch (err) {
    console.error("No se pudo verificar esquema de órdenes", err.message);
  }
};

module.exports = ensureOrderSchema;
