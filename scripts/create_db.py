import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

conn = psycopg2.connect(
    host="pgm-uf6g0k3f34e78h46ko.pg.rds.aliyuncs.com",
    port=5432,
    user="admin_acc",
    password="PDaW3wpDvpp0OL",
    dbname="postgres",
)
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cur = conn.cursor()
cur.execute("SELECT 1 FROM pg_database WHERE datname='policy'")
if not cur.fetchone():
    cur.execute("CREATE DATABASE policy")
    print("Database 'policy' created successfully")
else:
    print("Database 'policy' already exists")
cur.close()
conn.close()
