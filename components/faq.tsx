import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "TripThai คืออะไร?",
    answer:
      "TripThai เป็นแพลตฟอร์มวางแผนการเดินทางท่องเที่ยวแบบ Road Trip ทั่วไทย ช่วยคำนวณงบประมาณ ค่าน้ำมัน ค่าที่พัก ค่าอาหาร พร้อมแนะนำเส้นทางและกิจกรรมแต่ละวัน ไม่ต้องวางแผนเอง ประหยัดเวลา",
  },
  {
    question: "ใช้ TripThai ฟรีหรือเปล่า?",
    answer:
      "ตอนนี้ TripThai ให้บริการฟรี 100% คุณสามารถดูแผนทริปทั้งหมด คำนวณงบประมาณ และบันทึกแผนการเดินทางได้โดยไม่เสียค่าใช้จ่าย ในอนาคตเราจะเปิดตัวฟีเจอร์เสริมแบบ Premium สำหรับผู้ที่ต้องการความสะดวกมากขึ้น",
  },
  {
    question: "งบประมาณที่แสดงแม่นยำแค่ไหน?",
    answer:
      "งบประมาณที่แสดงเป็นการประมาณการจากราคาเฉลี่ยในปัจจุบัน รวมค่าน้ำมัน ค่าทางด่วน ค่าอาหาร และค่าที่พัก ราคาจริงอาจแตกต่างไปตามฤดูกาล ราคาน้ำมัน และสไตล์การเดินทางของแต่ละคน แต่จะอยู่ในกรอบที่ใกล้เคียงกัน",
  },
  {
    question: "สามารถปรับแต่งแผนทริปได้เองไหม?",
    answer:
      "ในเวอร์ชั่นปัจจุบัน เราให้แผนทริปสำเร็จรูปที่คัดสรรมาแล้ว แต่ในอนาคตเราจะเพิ่มฟีเจอร์ให้คุณสามารถปรับแต่งเส้นทาง เพิ่ม-ลดจุดแวะ เปลี่ยนที่พัก และปรับงบประมาณได้เองตามความต้องการ",
  },
  {
    question: "TripThai มี Navigation แบบเรียลไทม์ไหม?",
    answer:
      "ตอนนี้ TripThai เป็นเครื่องมือวางแผนทริปเท่านั้น ไม่มี Navigation แบบเรียลไทม์ แต่เราจะแสดงพิกัดและแผนที่เส้นทางให้ คุณสามารถใช้คู่กับ Google Maps หรือแอป Navigation อื่นๆ ได้",
  },
  {
    question: "บันทึกทริปไว้ได้กี่ทริป?",
    answer:
      "ขณะนี้การบันทึกทริปจะส่งข้อมูลไปยังอีเมลของคุณ ในอนาคตเราจะมีระบบบัญชีผู้ใช้ที่ให้คุณล็อกอินและบันทึกทริปได้ไม่จำกัด พร้อมซิงค์ข้อมูลระหว่างมือถือและคอมพิวเตอร์",
  },
  {
    question: "มีเส้นทางให้เลือกกี่แบบ?",
    answer:
      "ตอนนี้เรามีเส้นทางยอดนิยม 9 เส้นทาง ครบทั้งทะเล ภูเขา และเมืองประวัติศาสตร์ ตั้งแต่ทริปวันเดียวไปจนถึง 4 วัน 3 คืน เราจะอัปเดตเพิ่มเส้นทางใหม่ๆ อย่างต่อเนื่อง",
  },
  {
    question: "รองรับการเดินทางแบบกลุ่มหรือครอบครัวไหม?",
    answer:
      "งบประมาณที่แสดงเป็นการประมาณการสำหรับ 2-4 คน ถ้าไปกลุ่มใหญ่สามารถแชร์ค่าน้ำมัน ค่าที่พัก จะช่วยลดค่าใช้จ่ายต่อหัวได้มาก ในอนาคตเราจะเพิ่มฟีเจอร์คำนวณงบตามจำนวนคน",
  },
]

export function FAQ() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 lg:px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            คำถามที่พบบ่อย
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            สิ่งที่คุณอาจอยากรู้
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            คำตอบสำหรับคำถามที่ถูกถามบ่อยที่สุดเกี่ยวกับ TripThai
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-lg border border-border bg-card px-6 shadow-sm"
            >
              <AccordionTrigger className="text-left text-base font-semibold text-card-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h3 className="text-xl font-semibold text-foreground">
            ยังมีคำถามอื่นๆ อีกไหม?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            ติดต่อเราได้ทางอีเมล hello@tripthai.app หรือ Facebook Page: TripThai
          </p>
        </div>
      </div>
    </section>
  )
}
