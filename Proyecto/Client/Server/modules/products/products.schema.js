const ensureProductsSchema = async (pool) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL DEFAULT 0,
        category TEXT NOT NULL DEFAULT '',
        image TEXT NOT NULL DEFAULT '',
        stock INTEGER NOT NULL DEFAULT 0,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        is_hotsale BOOLEAN NOT NULL DEFAULT FALSE,
        category_id INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await pool.query(`
  CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
`);
    await pool.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS is_hotsale BOOLEAN NOT NULL DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS category_id INTEGER;
    `);

    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'products_category_id_fkey'
        ) THEN
          ALTER TABLE products
          ADD CONSTRAINT products_category_id_fkey
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
        END IF;
      END $$;
    `);

    await pool.query(`
      UPDATE products
      SET active = TRUE
      WHERE active IS NULL;
    `);

    await pool.query(`
      UPDATE products
      SET is_hotsale = FALSE
      WHERE is_hotsale IS NULL;
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
    `);

    await pool.query(`
      UPDATE products p
      SET category_id = c.id
      FROM categories c
      WHERE p.category_id IS NULL
        AND LOWER(TRIM(p.category)) = LOWER(TRIM(c.name));
    `);
  } catch (error) {
    console.error("No se pudo verificar esquema de productos", error.message);
  }
};

module.exports = ensureProductsSchema;
