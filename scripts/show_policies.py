"""查看 policies 表中的数据"""
import os
import sys

import psycopg2
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

raw_url = os.getenv("DATABASE_URL", "")
db_url = raw_url.replace("postgresql+asyncpg://", "postgresql://")

conn = psycopg2.connect(db_url)
cur = conn.cursor()

cur.execute("SELECT COUNT(*) FROM policies")
total = cur.fetchone()[0]
print(f"=== policies 表共 {total} 条记录 ===\n")

if total == 0:
    print("（空表，暂无政策数据）")
else:
    cur.execute("""
        SELECT id, title, issuing_authority, level, policy_type,
               status, is_opc_policy, region, publish_date, apply_end_date
        FROM policies
        ORDER BY created_at DESC
        LIMIT 50
    """)
    rows = cur.fetchall()
    cols = [desc[0] for desc in cur.description]

    col_widths = [max(len(str(c)), max((len(str(row[i] or "")) for row in rows), default=0)) for i, c in enumerate(cols)]

    header = " | ".join(c.ljust(w) for c, w in zip(cols, col_widths))
    print(header)
    print("-+-".join("-" * w for w in col_widths))

    for row in rows:
        line = " | ".join(str(v or "").ljust(w) for v, w in zip(row, col_widths))
        print(line)

    if total > 50:
        print(f"\n... 仅显示最近 50 条，共 {total} 条")

cur.close()
conn.close()
