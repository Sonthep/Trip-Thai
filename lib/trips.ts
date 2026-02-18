export type TripDay = {
  day: number
  title: string
  items: string[]
}

export type TripBudget = {
  fuel: number
  toll: number
  food: number
  accommodation: number
  total: number
}

export type TripFeaturedMeta = {
  duration: string
  driveTime: string
  budgetLabel: string
  tag: string
  tagColor: string
  breakdown: { fuel: number; food: number; stay: number }
}

export type TripDetail = {
  slug: string
  name: string
  from: string
  to: string
  distanceKm: number
  durationHours: number
  durationLabel: string
  budgetRangeLabel: string
  budget: TripBudget
  itinerary: TripDay[]
  originLocation: { lat: number; lng: number }
  destinationLocation: { lat: number; lng: number }
  featured: TripFeaturedMeta
}

export const TRIPS: TripDetail[] = [
  {
    slug: "bangkok-chiang-mai",
    name: "กรุงเทพ → เชียงใหม่",
    from: "กรุงเทพ",
    to: "เชียงใหม่",
    distanceKm: 700,
    durationHours: 9.5,
    durationLabel: "ขับรถประมาณ 9–10 ชม.",
    budgetRangeLabel: "งบรวม 8,000 – 12,000 บาท / ทริป 3 วัน 2 คืน",
    budget: {
      fuel: 2600,
      toll: 320,
      food: 3600,
      accommodation: 2400,
      total: 2600 + 320 + 3600 + 2400,
    },
    itinerary: [
      {
        day: 1,
        title: "ออกเดินทางจากกรุงเทพ – เชียงใหม่",
        items: [
          "ออกเดินทางจากกรุงเทพ ช่วงเช้ามืด แวะปั๊มน้ำมันใหญ่เพื่อเติมน้ำมันและซื้ออาหารเช้า",
          "แวะพักรถที่นครสวรรค์ / กำแพงเพชร สำหรับเข้าห้องน้ำและยืดเส้นยืดสาย",
          "มาถึงเชียงใหม่ช่วงบ่าย เช็คอินที่โรงแรม/โฮเทลในตัวเมือง",
          "เย็น: เดินเล่นถนนนิมมานฯ หรือคาเฟ่บนดาดฟ้า ชมวิวพระอาทิตย์ตก",
        ],
      },
      {
        day: 2,
        title: "เที่ยวรอบเชียงใหม่ – วัด คาเฟ่ และจุดชมวิว",
        items: [
          "เช้า: ไหว้พระที่ดอยสุเทพ หรือวัดพระธาตุดอยคำ ชมวิวเมืองเชียงใหม่",
          "กลางวัน: คาเฟ่วิวภูเขา/แม่น้ำ รอบนอกตัวเมือง",
          "บ่าย: เดินเล่นคูเมืองเชียงใหม่ / คาเฟ่สไตล์มินิมอล",
          "ค่ำ: ดินเนอร์ร้านอาหารท้องถิ่น หรือถนนคนเดิน (ถ้าตรงกับวันเสาร์/อาทิตย์)",
        ],
      },
      {
        day: 3,
        title: "เดินทางกลับกรุงเทพ",
        items: [
          "เช้า: เช็คเอาท์ ออกเดินทางจากเชียงใหม่",
          "แวะทานกลางวันระหว่างทางที่กำแพงเพชร / นครสวรรค์",
          "ถึงกรุงเทพช่วงค่ำ พักผ่อนหลังจบทริป",
        ],
      },
    ],
    originLocation: {
      lat: 13.7563,
      lng: 100.5018,
    },
    destinationLocation: {
      lat: 18.7883,
      lng: 98.9853,
    },
    featured: {
      duration: "3 วัน 2 คืน",
      driveTime: "9.5 ชม.",
      budgetLabel: "8,000 - 12,000 ฿",
      tag: "Long Trip",
      tagColor: "bg-secondary text-secondary-foreground",
      breakdown: { fuel: 28, food: 40, stay: 32 },
    },
  },
  {
    slug: "bangkok-khao-yai",
    name: "กรุงเทพ → เขาใหญ่",
    from: "กรุงเทพ",
    to: "เขาใหญ่",
    distanceKm: 200,
    durationHours: 3,
    durationLabel: "ขับรถประมาณ 3 ชม.",
    budgetRangeLabel: "งบรวม 3,500 – 5,000 บาท / ทริป 2 วัน 1 คืน",
    budget: {
      fuel: 1200,
      toll: 200,
      food: 1300,
      accommodation: 1700,
      total: 1200 + 200 + 1300 + 1700,
    },
    itinerary: [
      {
        day: 1,
        title: "เดินทางสู่เขาใหญ่ และพักผ่อนธรรมชาติ",
        items: [
          "ออกจากกรุงเทพช่วงเช้า แวะเติมน้ำมันก่อนขึ้นมิตรภาพ",
          "แวะคาเฟ่หรือร้านอาหารท้องถิ่นปากช่องช่วงเที่ยง",
          "บ่ายเช็คอินที่พัก และเดินเล่นจุดชมวิวใกล้ที่พัก",
        ],
      },
      {
        day: 2,
        title: "เที่ยวอุทยานและกลับกรุงเทพ",
        items: [
          "เช้าเที่ยวอุทยานแห่งชาติเขาใหญ่หรือจุดถ่ายรูปยอดนิยม",
          "ทานกลางวันก่อนออกเดินทางกลับ",
          "กลับถึงกรุงเทพช่วงเย็น",
        ],
      },
    ],
    originLocation: {
      lat: 13.7563,
      lng: 100.5018,
    },
    destinationLocation: {
      lat: 14.4432,
      lng: 101.3722,
    },
    featured: {
      duration: "2 วัน 1 คืน",
      driveTime: "3 ชม.",
      budgetLabel: "3,500 - 5,000 ฿",
      tag: "Popular",
      tagColor: "bg-accent text-accent-foreground",
      breakdown: { fuel: 35, food: 30, stay: 35 },
    },
  },
  {
    slug: "bangkok-kanchanaburi",
    name: "กรุงเทพ → กาญจนบุรี",
    from: "กรุงเทพ",
    to: "กาญจนบุรี",
    distanceKm: 130,
    durationHours: 2.5,
    durationLabel: "ขับรถประมาณ 2.5 ชม.",
    budgetRangeLabel: "งบรวม 2,800 – 4,500 บาท / ทริป 2 วัน 1 คืน",
    budget: {
      fuel: 900,
      toll: 100,
      food: 1400,
      accommodation: 1500,
      total: 900 + 100 + 1400 + 1500,
    },
    itinerary: [
      {
        day: 1,
        title: "เที่ยวเมืองกาญจนบุรี",
        items: [
          "ออกจากกรุงเทพช่วงเช้า ไปถึงกาญจนบุรีช่วงสาย",
          "เที่ยวสะพานข้ามแม่น้ำแควและพิพิธภัณฑ์ใกล้เคียง",
          "ค่ำพักผ่อนริมน้ำและทานอาหารท้องถิ่น",
        ],
      },
      {
        day: 2,
        title: "แวะธรรมชาติและเดินทางกลับ",
        items: [
          "เช้าแวะคาเฟ่หรือน้ำตกยอดนิยม",
          "ทานกลางวันก่อนออกเดินทางกลับ",
          "กลับถึงกรุงเทพช่วงบ่ายถึงเย็น",
        ],
      },
    ],
    originLocation: {
      lat: 13.7563,
      lng: 100.5018,
    },
    destinationLocation: {
      lat: 14.0228,
      lng: 99.5328,
    },
    featured: {
      duration: "2 วัน 1 คืน",
      driveTime: "2.5 ชม.",
      budgetLabel: "2,800 - 4,500 ฿",
      tag: "Weekend Trip",
      tagColor: "bg-primary text-primary-foreground",
      breakdown: { fuel: 25, food: 35, stay: 40 },
    },
  },
  {
    slug: "bangkok-hua-hin",
    name: "กรุงเทพ → หัวหิน",
    from: "กรุงเทพ",
    to: "หัวหิน",
    distanceKm: 195,
    durationHours: 3,
    durationLabel: "ขับรถประมาณ 3 ชม.",
    budgetRangeLabel: "งบรวม 4,500 – 7,000 บาท / ทริป 3 วัน 2 คืน",
    budget: {
      fuel: 1200,
      toll: 200,
      food: 2200,
      accommodation: 2400,
      total: 1200 + 200 + 2200 + 2400,
    },
    itinerary: [
      {
        day: 1,
        title: "เดินทางถึงหัวหินและพักผ่อนชายหาด",
        items: [
          "ออกจากกรุงเทพช่วงเช้า ถึงหัวหินก่อนเที่ยง",
          "เช็คอินที่พักและพักผ่อนริมทะเล",
          "ค่ำเดินตลาดโต้รุ่งหัวหิน",
        ],
      },
      {
        day: 2,
        title: "เที่ยวคาเฟ่และจุดชมวิว",
        items: [
          "เช้าแวะคาเฟ่และจุดถ่ายรูปยอดนิยม",
          "บ่ายเที่ยวสถานที่ใกล้เคียง เช่น เขาตะเกียบ",
          "ค่ำทานซีฟู้ดและเดินเล่นชายหาด",
        ],
      },
      {
        day: 3,
        title: "เช็คเอาท์และกลับกรุงเทพ",
        items: [
          "เช้าพักผ่อนตามอัธยาศัย",
          "ทานกลางวันก่อนออกเดินทางกลับ",
          "ถึงกรุงเทพช่วงเย็น",
        ],
      },
    ],
    originLocation: {
      lat: 13.7563,
      lng: 100.5018,
    },
    destinationLocation: {
      lat: 12.5684,
      lng: 99.9577,
    },
    featured: {
      duration: "3 วัน 2 คืน",
      driveTime: "3 ชม.",
      budgetLabel: "4,500 - 7,000 ฿",
      tag: "Family Friendly",
      tagColor: "bg-secondary text-secondary-foreground",
      breakdown: { fuel: 20, food: 35, stay: 45 },
    },
  },
  {
    slug: "bangkok-phuket",
    name: "กรุงเทพ → ภูเก็ต",
    from: "กรุงเทพ",
    to: "ภูเก็ต",
    distanceKm: 850,
    durationHours: 12,
    durationLabel: "ขับรถประมาณ 12 ชม.",
    budgetRangeLabel: "งบรวม 10,000 – 15,000 บาท / ทริป 4 วัน 3 คืน",
    budget: {
      fuel: 3400,
      toll: 450,
      food: 4800,
      accommodation: 4500,
      total: 3400 + 450 + 4800 + 4500,
    },
    itinerary: [
      {
        day: 1,
        title: "เดินทางจากกรุงเทพ → ชุมพร",
        items: [
          "ออกเดินทางจากกรุงเทพช่วงเช้ามืด (4-5 โมงเช้า)",
          "แวะพักรถและทานอาหารกลางวันที่ชุมพร",
          "บ่ายเดินทางต่อถึงระนอง/พังงา เช็คอินที่พัก",
          "ค่ำพักผ่อนและทานอาหารท้องถิ่น",
        ],
      },
      {
        day: 2,
        title: "เดินทางต่อถึงภูเก็ต และเที่ยวชายหาด",
        items: [
          "เช้าเดินทางต่อไปภูเก็ต ถึงช่วงสาย",
          "เช็คอินที่พักในภูเก็ต (ป่าตอง/กะตะ/กะรน)",
          "บ่ายเที่ยวชายหาดและคาเฟ่วิวทะเล",
          "ค่ำเดินถนนคนเดินและทานซีฟู้ด",
        ],
      },
      {
        day: 3,
        title: "เที่ยวรอบเกาะภูเก็ต",
        items: [
          "เช้าไปจุดชมวิวแหลมพรหมเทพ หรือวัดฉลอง",
          "กลางวันทานอาหารและเที่ยวเมืองเก่าภูเก็ต",
          "บ่ายพักผ่อนชายหาด หรือสปา",
          "ค่ำทานดินเนอร์พิเศษและดูพระอาทิตย์ตก",
        ],
      },
      {
        day: 4,
        title: "เดินทางกลับกรุงเทพ",
        items: [
          "เช้าเช็คเอาท์และออกเดินทางกลับ",
          "แวะทานกลางวันระหว่างทาง",
          "ถึงกรุงเทพช่วงดึก",
        ],
      },
    ],
    originLocation: {
      lat: 13.7563,
      lng: 100.5018,
    },
    destinationLocation: {
      lat: 7.8804,
      lng: 98.3923,
    },
    featured: {
      duration: "4 วัน 3 คืน",
      driveTime: "12 ชม.",
      budgetLabel: "10,000 - 15,000 ฿",
      tag: "Beach Paradise",
      tagColor: "bg-accent text-accent-foreground",
      breakdown: { fuel: 26, food: 36, stay: 38 },
    },
  },
  {
    slug: "bangkok-ayutthaya",
    name: "กรุงเทพ → อยุธยา",
    from: "กรุงเทพ",
    to: "อยุธยา",
    distanceKm: 85,
    durationHours: 1.5,
    durationLabel: "ขับรถประมาณ 1.5 ชม.",
    budgetRangeLabel: "งบรวม 1,500 – 2,500 บาท / ทริปวันเดียว",
    budget: {
      fuel: 600,
      toll: 100,
      food: 800,
      accommodation: 0,
      total: 600 + 100 + 800,
    },
    itinerary: [
      {
        day: 1,
        title: "เที่ยวเมืองเก่าอยุธยา",
        items: [
          "ออกจากกรุงเทพช่วงเช้า ถึงอยุธยาช่วงสาย",
          "เที่ยวชมวัดประวัติศาสตร์ เช่น วัดมหาธาตุ วัดพระศรีสรรเพชญ์",
          "ทานกลางวันอาหารพื้นเมือง",
          "บ่ายเที่ยวต่อที่วัดไชยวัฒนาราม หรือตลาดน้ำอโยธยา",
          "เย็นเดินทางกลับกรุงเทพ",
        ],
      },
    ],
    originLocation: {
      lat: 13.7563,
      lng: 100.5018,
    },
    destinationLocation: {
      lat: 14.3532,
      lng: 100.5775,
    },
    featured: {
      duration: "1 วัน",
      driveTime: "1.5 ชม.",
      budgetLabel: "1,500 - 2,500 ฿",
      tag: "Day Trip",
      tagColor: "bg-primary text-primary-foreground",
      breakdown: { fuel: 40, food: 60, stay: 0 },
    },
  },
  {
    slug: "bangkok-pattaya",
    name: "กรุงเทพ → พัทยา",
    from: "กรุงเทพ",
    to: "พัทยา",
    distanceKm: 147,
    durationHours: 2,
    durationLabel: "ขับรถประมาณ 2 ชม.",
    budgetRangeLabel: "งบรวม 3,000 – 5,500 บาท / ทริป 2 วัน 1 คืน",
    budget: {
      fuel: 1000,
      toll: 150,
      food: 1800,
      accommodation: 1800,
      total: 1000 + 150 + 1800 + 1800,
    },
    itinerary: [
      {
        day: 1,
        title: "เดินทางถึงพัทยาและเที่ยวชายหาด",
        items: [
          "ออกจากกรุงเทพช่วงเช้า ถึงพัทยาช่วงสาย",
          "เช็คอินที่พักและพักผ่อนชายหาด",
          "บ่ายเล่นกิจกรรมทางน้ำหรือเที่ยวเกาะล้าน",
          "ค่ำเดินถนนคนเดินและทานอาหารทะเล",
        ],
      },
      {
        day: 2,
        title: "เที่ยวแหล่งท่องเที่ยวและกลับ",
        items: [
          "เช้าแวะจุดชมวิวหรือคาเฟ่ยอดนิยม",
          "ชมการแสดงหรือเที่ยวสวนนงนุช (ตัวเลือก)",
          "ทานกลางวันก่อนออกเดินทางกลับ",
          "กลับถึงกรุงเทพช่วงเย็น",
        ],
      },
    ],
    originLocation: {
      lat: 13.7563,
      lng: 100.5018,
    },
    destinationLocation: {
      lat: 12.9236,
      lng: 100.8825,
    },
    featured: {
      duration: "2 วัน 1 คืน",
      driveTime: "2 ชม.",
      budgetLabel: "3,000 - 5,500 ฿",
      tag: "Quick Escape",
      tagColor: "bg-secondary text-secondary-foreground",
      breakdown: { fuel: 22, food: 38, stay: 40 },
    },
  },
  {
    slug: "bangkok-chiang-rai",
    name: "กรุงเทพ → เชียงราย",
    from: "กรุงเทพ",
    to: "เชียงราย",
    distanceKm: 830,
    durationHours: 11,
    durationLabel: "ขับรถประมาณ 11 ชม.",
    budgetRangeLabel: "งบรวม 9,500 – 14,000 บาท / ทริป 4 วัน 3 คืน",
    budget: {
      fuel: 3200,
      toll: 400,
      food: 4500,
      accommodation: 3600,
      total: 3200 + 400 + 4500 + 3600,
    },
    itinerary: [
      {
        day: 1,
        title: "เดินทางจากกรุงเทพ → พิษณุโลก/แพร่",
        items: [
          "ออกเดินทางช่วงเช้ามืด",
          "แวะพักรถและทานอาหารกลางวันที่นครสวรรค์",
          "บ่ายเดินทางต่อถึงพิษณุโลกหรือแพร่ เช็คอินที่พัก",
          "ค่ำพักผ่อนและทานอาหารท้องถิ่น",
        ],
      },
      {
        day: 2,
        title: "เดินทางต่อถึงเชียงรายและเที่ยวเมือง",
        items: [
          "เช้าเดินทางต่อไปเชียงราย",
          "เที่ยววัดร่องขุ่นและจุดถ่ายรูป",
          "บ่ายเช็คอินที่พักและเดินเล่นตัวเมือง",
          "ค่ำเดินตลาดกลางคืนเชียงราย",
        ],
      },
      {
        day: 3,
        title: "เที่ยวรอบเชียงราย",
        items: [
          "เช้าขึ้นดอยแม่สลองหรือดอยตุง",
          "เที่ยวสามเหลี่ยมทองคำและริมโขง",
          "บ่ายแวะวัดห้วยปลากั้งหรือคาเฟ่วิวภูเขา",
          "ค่ำพักผ่อนและเตรียมเดินทางกลับ",
        ],
      },
      {
        day: 4,
        title: "เดินทางกลับกรุงเทพ",
        items: [
          "เช้าเช็คเอาท์และออกเดินทางกลับ",
          "แวะทานกลางวันระหว่างทาง",
          "ถึงกรุงเทพช่วงดึก",
        ],
      },
    ],
    originLocation: {
      lat: 13.7563,
      lng: 100.5018,
    },
    destinationLocation: {
      lat: 19.9105,
      lng: 99.8406,
    },
    featured: {
      duration: "4 วัน 3 คืน",
      driveTime: "11 ชม.",
      budgetLabel: "9,500 - 14,000 ฿",
      tag: "Adventure",
      tagColor: "bg-accent text-accent-foreground",
      breakdown: { fuel: 28, food: 40, stay: 32 },
    },
  },
  {
    slug: "bangkok-krabi",
    name: "กรุงเทพ → กระบี่",
    from: "กรุงเทพ",
    to: "กระบี่",
    distanceKm: 814,
    durationHours: 11.5,
    durationLabel: "ขับรถประมาณ 11–12 ชม.",
    budgetRangeLabel: "งบรวม 11,000 – 16,000 บาท / ทริป 4 วัน 3 คืน",
    budget: {
      fuel: 3300,
      toll: 420,
      food: 5000,
      accommodation: 4800,
      total: 3300 + 420 + 5000 + 4800,
    },
    itinerary: [
      {
        day: 1,
        title: "เดินทางจากกรุงเทพ → สุราษฎร์ธานี",
        items: [
          "ออกเดินทางช่วงเช้ามืด (4-5 โมงเช้า)",
          "แวะทานอาหารกลางวันที่ชุมพรหรือระนอง",
          "บ่ายถึงสุราษฎร์ธานี เช็คอินที่พัก",
          "ค่ำพักผ่อนและทานอาหารริมทะเล",
        ],
      },
      {
        day: 2,
        title: "เดินทางต่อถึงกระบี่และเที่ยวชายหาด",
        items: [
          "เช้าเดินทางต่อไปกระบี่",
          "เช็คอินที่พักในอ่าวนาง",
          "บ่ายเที่ยวชายหาดไร่เลย์หรือถ้ำพระนาง",
          "ค่ำดินเนอร์ริมทะเล",
        ],
      },
      {
        day: 3,
        title: "ทัวร์เกาะและจุดชมวิว",
        items: [
          "เช้าทัวร์เกาะ 4 เกาะหรือเกาะพีพี",
          "บ่ายพักผ่อนชายหาด",
          "ค่ำเดินเล่นถนนคนเดินและซื้อของฝาก",
        ],
      },
      {
        day: 4,
        title: "เดินทางกลับกรุงเทพ",
        items: [
          "เช้าเช็คเอาท์และออกเดินทางกลับ",
          "แวะทานกลางวันระหว่างทาง",
          "ถึงกรุงเทพช่วงดึก",
        ],
      },
    ],
    originLocation: {
      lat: 13.7563,
      lng: 100.5018,
    },
    destinationLocation: {
      lat: 8.0863,
      lng: 98.9063,
    },
    featured: {
      duration: "4 วัน 3 คืน",
      driveTime: "11.5 ชม.",
      budgetLabel: "11,000 - 16,000 ฿",
      tag: "Island Hopping",
      tagColor: "bg-primary text-primary-foreground",
      breakdown: { fuel: 25, food: 37, stay: 38 },
    },
  },
]

export function getTripBySlug(slug: string): TripDetail | undefined {
  return TRIPS.find((trip) => trip.slug === slug)
}

export function getFeaturedTrips(): TripDetail[] {
  return TRIPS.filter((trip) => 
    [
      "bangkok-ayutthaya",
      "bangkok-khao-yai", 
      "bangkok-pattaya",
      "bangkok-hua-hin",
      "bangkok-chiang-mai",
      "bangkok-phuket"
    ].includes(trip.slug)
  )
}