# Git Workflow Standard (TripThai)

เอกสารมาตรฐานการทำงานกับ Git สำหรับโปรเจกต์ TripThai

## 1) Objective

- แยกการพัฒนางานออกจาก `main` เพื่อลดความเสี่ยง
- รวมงานอย่างมีหลักเกณฑ์และตรวจสอบย้อนกลับได้
- ดูแล repository ให้สะอาดด้วยการลบ branch ที่จบงานแล้ว

## 2) Branching Model

- `main` = production-ready branch
- `feature/<topic>` = งานพัฒนาฟีเจอร์
- `fix/<topic>` = งานแก้บั๊ก
- `hotfix/<topic>` = งานแก้ด่วน production

ตัวอย่างชื่อ branch:

- `feature/map-default-fullscreen`
- `fix/explore-map-height`
- `hotfix/lead-submit-timeout`

## 3) Commit Message Convention

แนะนำให้ใช้ imperative tense และสื่อสารชัดเจน:

- `Increase default map viewport size`
- `Fix province filter reset behavior`
- `Add git workflow documentation`

## 4) Standard Delivery Flow

### Step A — Sync ล่าสุดจาก `main`

```bash
git checkout main
git pull
```

### Step B — สร้าง branch ใหม่

```bash
git checkout -b feature/<topic>
```

### Step C — พัฒนาและ commit

```bash
git add .
git commit -m "<clear message>"
```

### Step D — Push branch ครั้งแรก

```bash
git push -u origin feature/<topic>
```

### Step E — Merge เข้า `main`

ผ่าน Pull Request (แนะนำ) หรือ merge local ตามกระบวนการทีม:

```bash
git checkout main
git pull
git merge feature/<topic>
git push
```

## 5) Branch Cleanup Policy

ลบ branch เมื่อเงื่อนไขครบ:

- งาน merge เข้า `main` เรียบร้อย
- ไม่มีผู้ใช้งาน branch นั้นต่อ
- CI/Deploy บน `main` ผ่าน

คำสั่งลบ:

```bash
# delete local branch
git branch -d feature/<topic>

# delete remote branch
git push origin --delete feature/<topic>
```

## 6) Repository Cleanup (Keep Only `main`)

ใช้เฉพาะกรณีต้องการ cleanup ใหญ่ และมั่นใจว่า branch อื่นไม่ถูกใช้งานแล้ว

```bash
# ตรวจสอบ branch ปัจจุบัน
git branch
git branch -r

# ลบ local branches ที่ไม่ใช่ main (ตัวอย่าง)
git branch -d feature/thailand-map-ui

# ลบ remote branches ที่ไม่ใช่ main (ตัวอย่าง)
git push origin --delete feature/thailand-map-ui tripthai-saas-ui
```

สถานะเป้าหมายหลัง cleanup:

- local: `main`
- remote: `origin/main`

## 7) Operational Notes

- หาก remote แจ้งว่า repository ถูกย้าย ให้ปรับ URL ของ `origin` ให้เป็นปลายทางใหม่
- หลีกเลี่ยงการ `git push --force` บน `main`
- ก่อนลบหลาย branch พร้อมกัน ควรแจ้งทีมเสมอ

## 8) Quick Verification Commands

```bash
git status --short --branch
git branch
git branch -r
git log --oneline -n 10
```

---

อัปเดตล่าสุด: 2026-03-04
