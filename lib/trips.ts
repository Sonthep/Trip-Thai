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

const CORE_TRIPS: TripDetail[] = [
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

type ProvinceRegion = "north" | "northeast" | "central" | "east" | "west" | "south"

type ProvinceSeed = {
  slug: string
  name: string
  region: ProvinceRegion
}

const PROVINCES: ProvinceSeed[] = [
  // North (17)
  { slug: "chiang-mai", name: "เชียงใหม่", region: "north" },
  { slug: "chiang-rai", name: "เชียงราย", region: "north" },
  { slug: "lampang", name: "ลำปาง", region: "north" },
  { slug: "lamphun", name: "ลำพูน", region: "north" },
  { slug: "mae-hong-son", name: "แม่ฮ่องสอน", region: "north" },
  { slug: "nan", name: "น่าน", region: "north" },
  { slug: "phayao", name: "พะเยา", region: "north" },
  { slug: "phrae", name: "แพร่", region: "north" },
  { slug: "uttaradit", name: "อุตรดิตถ์", region: "north" },
  { slug: "tak", name: "ตาก", region: "north" },
  { slug: "sukhothai", name: "สุโขทัย", region: "north" },
  { slug: "phitsanulok", name: "พิษณุโลก", region: "north" },
  { slug: "phichit", name: "พิจิตร", region: "north" },
  { slug: "kamphaeng-phet", name: "กำแพงเพชร", region: "north" },
  { slug: "nakhon-sawan", name: "นครสวรรค์", region: "north" },
  { slug: "uthai-thani", name: "อุทัยธานี", region: "north" },
  { slug: "phetchabun", name: "เพชรบูรณ์", region: "north" },

  // Northeast (20)
  { slug: "kalasin", name: "กาฬสินธุ์", region: "northeast" },
  { slug: "khon-kaen", name: "ขอนแก่น", region: "northeast" },
  { slug: "chaiyaphum", name: "ชัยภูมิ", region: "northeast" },
  { slug: "nakhon-phanom", name: "นครพนม", region: "northeast" },
  { slug: "nakhon-ratchasima", name: "นครราชสีมา", region: "northeast" },
  { slug: "bueng-kan", name: "บึงกาฬ", region: "northeast" },
  { slug: "buri-ram", name: "บุรีรัมย์", region: "northeast" },
  { slug: "maha-sarakham", name: "มหาสารคาม", region: "northeast" },
  { slug: "mukdahan", name: "มุกดาหาร", region: "northeast" },
  { slug: "yasothon", name: "ยโสธร", region: "northeast" },
  { slug: "roi-et", name: "ร้อยเอ็ด", region: "northeast" },
  { slug: "loei", name: "เลย", region: "northeast" },
  { slug: "si-sa-ket", name: "ศรีสะเกษ", region: "northeast" },
  { slug: "sakon-nakhon", name: "สกลนคร", region: "northeast" },
  { slug: "surin", name: "สุรินทร์", region: "northeast" },
  { slug: "nong-khai", name: "หนองคาย", region: "northeast" },
  { slug: "nong-bua-lamphu", name: "หนองบัวลำภู", region: "northeast" },
  { slug: "udon-thani", name: "อุดรธานี", region: "northeast" },
  { slug: "ubon-ratchathani", name: "อุบลราชธานี", region: "northeast" },
  { slug: "amnat-charoen", name: "อำนาจเจริญ", region: "northeast" },

  // Central / East / West (26)
  { slug: "bangkok", name: "กรุงเทพมหานคร", region: "central" },
  { slug: "samut-prakan", name: "สมุทรปราการ", region: "central" },
  { slug: "nonthaburi", name: "นนทบุรี", region: "central" },
  { slug: "pathum-thani", name: "ปทุมธานี", region: "central" },
  { slug: "ayutthaya", name: "พระนครศรีอยุธยา", region: "central" },
  { slug: "ang-thong", name: "อ่างทอง", region: "central" },
  { slug: "lopburi", name: "ลพบุรี", region: "central" },
  { slug: "sing-buri", name: "สิงห์บุรี", region: "central" },
  { slug: "chai-nat", name: "ชัยนาท", region: "central" },
  { slug: "saraburi", name: "สระบุรี", region: "central" },
  { slug: "nakhon-nayok", name: "นครนายก", region: "central" },
  { slug: "prachin-buri", name: "ปราจีนบุรี", region: "central" },
  { slug: "chachoengsao", name: "ฉะเชิงเทรา", region: "central" },
  { slug: "sa-kaeo", name: "สระแก้ว", region: "east" },
  { slug: "chonburi", name: "ชลบุรี", region: "east" },
  { slug: "rayong", name: "ระยอง", region: "east" },
  { slug: "chanthaburi", name: "จันทบุรี", region: "east" },
  { slug: "trat", name: "ตราด", region: "east" },
  { slug: "kanchanaburi", name: "กาญจนบุรี", region: "west" },
  { slug: "ratchaburi", name: "ราชบุรี", region: "west" },
  { slug: "suphan-buri", name: "สุพรรณบุรี", region: "central" },
  { slug: "nakhon-pathom", name: "นครปฐม", region: "central" },
  { slug: "samut-sakhon", name: "สมุทรสาคร", region: "central" },
  { slug: "samut-songkhram", name: "สมุทรสงคราม", region: "central" },
  { slug: "phetchaburi", name: "เพชรบุรี", region: "west" },
  { slug: "prachuap-khiri-khan", name: "ประจวบคีรีขันธ์", region: "west" },

  // South (14)
  { slug: "chumphon", name: "ชุมพร", region: "south" },
  { slug: "ranong", name: "ระนอง", region: "south" },
  { slug: "surat-thani", name: "สุราษฎร์ธานี", region: "south" },
  { slug: "phang-nga", name: "พังงา", region: "south" },
  { slug: "phuket", name: "ภูเก็ต", region: "south" },
  { slug: "krabi", name: "กระบี่", region: "south" },
  { slug: "nakhon-si-thammarat", name: "นครศรีธรรมราช", region: "south" },
  { slug: "trang", name: "ตรัง", region: "south" },
  { slug: "phatthalung", name: "พัทลุง", region: "south" },
  { slug: "satun", name: "สตูล", region: "south" },
  { slug: "songkhla", name: "สงขลา", region: "south" },
  { slug: "pattani", name: "ปัตตานี", region: "south" },
  { slug: "yala", name: "ยะลา", region: "south" },
  { slug: "narathiwat", name: "นราธิวาส", region: "south" },
]

const BANGKOK = { lat: 13.7563, lng: 100.5018 }

const REGION_CENTER: Record<ProvinceRegion, { lat: number; lng: number }> = {
  north: { lat: 18.2, lng: 99.5 },
  northeast: { lat: 16.2, lng: 103.1 },
  central: { lat: 14.0, lng: 100.7 },
  east: { lat: 13.0, lng: 101.7 },
  west: { lat: 14.1, lng: 99.4 },
  south: { lat: 8.4, lng: 99.8 },
}

const REGION_TAG: Record<ProvinceRegion, { tag: string; tagColor: string }> = {
  north: { tag: "Mountain Route", tagColor: "bg-secondary text-secondary-foreground" },
  northeast: { tag: "Cultural Loop", tagColor: "bg-primary text-primary-foreground" },
  central: { tag: "City Escape", tagColor: "bg-accent text-accent-foreground" },
  east: { tag: "Coastal Drive", tagColor: "bg-accent text-accent-foreground" },
  west: { tag: "Nature Route", tagColor: "bg-secondary text-secondary-foreground" },
  south: { tag: "Sea & Islands", tagColor: "bg-primary text-primary-foreground" },
}

function toSeedNumber(value: string) {
  return value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

function estimateProvinceLocation(seed: ProvinceSeed) {
  if (seed.slug === "bangkok") {
    return BANGKOK
  }

  const regionCenter = REGION_CENTER[seed.region]
  const seedNumber = toSeedNumber(seed.slug)
  const latOffset = ((seedNumber % 23) - 11) * 0.08
  const lngOffset = ((seedNumber % 29) - 14) * 0.08

  return {
    lat: Number((regionCenter.lat + latOffset).toFixed(4)),
    lng: Number((regionCenter.lng + lngOffset).toFixed(4)),
  }
}

function haversineDistanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180
  const earthRadius = 6371

  const dLat = toRadians(b.lat - a.lat)
  const dLng = toRadians(b.lng - a.lng)
  const lat1 = toRadians(a.lat)
  const lat2 = toRadians(b.lat)

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2)

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return earthRadius * c
}

function roundToHundreds(value: number) {
  return Math.max(100, Math.round(value / 100) * 100)
}

function estimateDistance(seed: ProvinceSeed, destination: { lat: number; lng: number }) {
  if (seed.slug === "bangkok") {
    return 25
  }

  const directDistance = haversineDistanceKm(BANGKOK, destination)
  const roadFactor = seed.region === "south" || seed.region === "northeast" ? 1.35 : 1.28
  return Math.max(60, Math.round(directDistance * roadFactor))
}

function estimateDays(distanceKm: number) {
  if (distanceKm <= 120) return 1
  if (distanceKm <= 320) return 2
  if (distanceKm <= 700) return 3
  return 4
}

function buildItinerary(provinceName: string, days: number): TripDay[] {
  if (days === 1) {
    return [
      {
        day: 1,
        title: `One-day Trip: กรุงเทพ → ${provinceName}`,
        items: [
          `ออกเดินทางจากกรุงเทพช่วงเช้า เพื่อไปยัง${provinceName}`,
          `เที่ยวจุดไฮไลต์ของ${provinceName} เช่น วัด/คาเฟ่/ตลาดท้องถิ่น`,
          "พักผ่อนและทานอาหารขึ้นชื่อของจังหวัด",
          "เดินทางกลับกรุงเทพช่วงเย็น",
        ],
      },
    ]
  }

  const result: TripDay[] = [
    {
      day: 1,
      title: `เดินทางจากกรุงเทพไป${provinceName}`,
      items: [
        "ออกเดินทางจากกรุงเทพช่วงเช้า แวะพักรถระหว่างทางตามความเหมาะสม",
        `ถึง${provinceName}ช่วงบ่าย เช็คอินที่พักและพักผ่อน`,
        "ค่ำ: เดินเล่นย่านท้องถิ่นและทานอาหารประจำจังหวัด",
      ],
    },
  ]

  for (let day = 2; day < days; day += 1) {
    result.push({
      day,
      title: `เที่ยวรอบ${provinceName} (วันที่ ${day})`,
      items: [
        `เช้า: เที่ยวสถานที่ธรรมชาติหรือแลนด์มาร์กยอดนิยมของ${provinceName}`,
        "กลางวัน: ทานอาหารพื้นเมืองและพักผ่อน",
        "บ่าย: คาเฟ่/จุดชมวิว/ตลาดชุมชน",
        "ค่ำ: พักผ่อนตามอัธยาศัย",
      ],
    })
  }

  result.push({
    day: days,
    title: "เดินทางกลับกรุงเทพ",
    items: [
      "เช้า: เช็คเอาท์และแวะซื้อของฝาก",
      "ออกเดินทางกลับกรุงเทพพร้อมพักรถระหว่างทาง",
      "ถึงกรุงเทพช่วงเย็นหรือค่ำ",
    ],
  })

  return result
}

function createProvinceTrip(seed: ProvinceSeed): TripDetail {
  const destinationLocation = estimateProvinceLocation(seed)
  const distanceKm = estimateDistance(seed, destinationLocation)
  const days = estimateDays(distanceKm)
  const durationHours = Number((distanceKm / 75).toFixed(1))

  const fuel = roundToHundreds(((distanceKm * 2) / 14) * 38)
  const toll = distanceKm <= 80 ? 0 : roundToHundreds(distanceKm * 0.8)
  const food = roundToHundreds(days * 800)
  const accommodation = days > 1 ? roundToHundreds((days - 1) * 1400) : 0
  const total = fuel + toll + food + accommodation

  const lowBudget = roundToHundreds(total * 0.85)
  const highBudget = roundToHundreds(total * 1.2)

  const stayRatio = total > 0 ? Math.round((accommodation / total) * 100) : 0
  const foodRatio = total > 0 ? Math.round((food / total) * 100) : 0
  const fuelRatio = Math.max(10, 100 - stayRatio - foodRatio)

  const durationText = days === 1 ? "1 วัน" : `${days} วัน ${days - 1} คืน`
  const tripSlug = `bangkok-${seed.slug}`
  const regionTag = REGION_TAG[seed.region]

  return {
    slug: tripSlug,
    name: `กรุงเทพ → ${seed.name}`,
    from: "กรุงเทพ",
    to: seed.name,
    distanceKm,
    durationHours,
    durationLabel: `ขับรถประมาณ ${durationHours} ชม.`,
    budgetRangeLabel: `งบรวม ${lowBudget.toLocaleString("th-TH")} – ${highBudget.toLocaleString("th-TH")} บาท / ทริป ${durationText}`,
    budget: {
      fuel,
      toll,
      food,
      accommodation,
      total,
    },
    itinerary: buildItinerary(seed.name, days),
    originLocation: BANGKOK,
    destinationLocation,
    featured: {
      duration: durationText,
      driveTime: `${durationHours} ชม.`,
      budgetLabel: `${lowBudget.toLocaleString("th-TH")} - ${highBudget.toLocaleString("th-TH")} ฿`,
      tag: regionTag.tag,
      tagColor: regionTag.tagColor,
      breakdown: {
        fuel: fuelRatio,
        food: foodRatio,
        stay: Math.max(0, 100 - fuelRatio - foodRatio),
      },
    },
  }
}

function generateProvinceTrips(coreTrips: TripDetail[]) {
  const existingSlugs = new Set(coreTrips.map((trip) => trip.slug))
  return PROVINCES.map(createProvinceTrip).filter((trip) => !existingSlugs.has(trip.slug))
}

export const TRIPS: TripDetail[] = [...CORE_TRIPS, ...generateProvinceTrips(CORE_TRIPS)]

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