export interface MughalEmperor {
  id: string;
  name: string;
  period: string;
  portrait: string;
  bg: string;
  summary: string[];
  funFact: string;
}

export const mughalEmperors: MughalEmperor[] = [
  {
    id: "babur",
    name: "Babur",
    period: "1526–1530 CE",
    portrait: "/images/mughals/babur.PNG",
    bg: "linear-gradient(180deg, #ffffff, #f1fdf4)",
    summary: [
      "Founder of the Mughal Empire in India.",
      "Won the Battle of Panipat in 1526."
    ],
    funFact: "Babur loved gardens and wrote a famous diary called the Baburnama."
  },
  {
    id: "humayun",
    name: "Humayun",
    period: "1530–1540, 1555–1556 CE",
    portrait: "/images/mughals/humayun.PNG",
    bg: "linear-gradient(180deg, #ffffff, #eefcf3)",
    summary: [
      "Babur's eldest son.",
      "Regained the throne in 1555."
    ],
    funFact: "His name means 'fortunate' — and he truly made a comeback!"
  },
  {
    id: "akbar",
    name: "Akbar the Great",
    period: "1556–1605 CE",
    portrait: "/images/mughals/akbar.PNG",
    bg: "linear-gradient(180deg, #ffffff, #eafaf0)",
    summary: [
      "Led the empire to a Golden Age.",
      "Promoted peace, fairness, and learning."
    ],
    funFact: "His finance minister made smart tax systems."
  },
  {
    id: "jahangir",
    name: "Jahangir",
    period: "1605–1627 CE",
    portrait: "/images/mughals/Jahangir.PNG",
    bg: "linear-gradient(180deg, #ffffff, #e7f9ee)",
    summary: [
      "Akbar's son who loved nature and art.",
      "Encouraged culture and trade."
    ],
    funFact: "He kept a record of animals he admired."
  },
  {
    id: "shahjahan",
    name: "Shah Jahan",
    period: "1628–1658 CE",
    portrait: "/images/mughals/Shah Jahan.PNG",
    bg: "linear-gradient(180deg, #ffffff, #e4f8ec)",
    summary: [
      "Famous for building the Taj Mahal.",
      "Brought beautiful buildings and gardens."
    ],
    funFact: "The Taj Mahal looks pink in the morning!"
  },
  {
    id: "aurangzeb",
    name: "Aurangzeb",
    period: "1659–1707 CE",
    portrait: "/images/mughals/Aurangzeb.PNG",
    bg: "linear-gradient(180deg, #ffffff, #e2f7eb)",
    summary: [
      "Expanded the empire significantly.",
      "Known for strict governance."
    ],
    funFact: "He discouraged gambling and drinking."
  }
];
