"""查看数据库各表数据概况"""
import os

import psycopg2
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

raw_url = os.getenv("DATABASE_URL", "")
db_url = raw_url.replace("postgresql+asyncpg://", "postgresql://")

conn = psycopg2.connect(db_url)
cur = conn.cursor()

tables = [
    ("users", "id, phone, role, status, created_at"),
    ("enterprises", "id, user_id, name, credit_code, completeness_score"),
    ("talents", "id, user_id, name, completeness_score"),
    ("parks", "id, user_id, name, address, completeness_score"),
    ("policies", "id, title, level, policy_type, status, is_opc_policy, region"),
    ("materials", "id, user_id, file_name, category, status"),
    ("match_results", "id, user_id, entity_id, policy_id, match_score, match_status"),
    ("applications", "id, user_id, policy_id, status"),
    ("messages", "id, user_id, msg_type, title, is_read"),
    ("favorites", "id, user_id, policy_id"),
    ("chat_sessions", "id, user_id, title"),
]

for table_name, columns in tables:
    cur.execute(f"SELECT COUNT(*) FROM {table_name}")
    total = cur.fetchone()[0]
    print(f"\n{'=' * 60}")
    print(f"  {table_name} ({total} 条)")
    print(f"{'=' * 60}")

    if total == 0:
        print("  (空)")
        continue

    cur.execute(f"SELECT {columns} FROM {table_name} ORDER BY 1 LIMIT 20")
    rows = cur.fetchall()
    cols = [desc[0] for desc in cur.description]

    col_widths = []
    for i, c in enumerate(cols):
        max_data = max((len(str(row[i] or "")) for row in rows), default=0)
        col_widths.append(max(len(c), min(max_data, 40)))

    header = " | ".join(c.ljust(w) for c, w in zip(cols, col_widths))
    print(f"  {header}")
    print(f"  {'-+-'.join('-' * w for w in col_widths)}")

    for row in rows:
        line = " | ".join(str(v or "")[:40].ljust(w) for v, w in zip(row, col_widths))
        print(f"  {line}")

    if total > 20:
        print(f"  ... 仅显示 20 条，共 {total} 条")

cur.close()
conn.close()
print()
