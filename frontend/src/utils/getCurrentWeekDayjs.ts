import dayjs from "dayjs";

export function getCurrentWeekDays(createdAt: string | undefined) {
  const time = dayjs(createdAt).format("DD/MM/YYYY");
  const now = dayjs().valueOf();
  const day = parseInt(dayjs().format("d"));
  const DAY = 60 * 60 * 24 * 1000;
  let dates: any = [];

  for (let i: number = day; i >= 0; i--) {
    const dateMili = dayjs(now - DAY * i);
    const day = dateMili.format("dddd");
    const date = dateMili.format("DD/MM/YYYY");
    dates.push({ date, day });
  }
  const dayInCurrentWeek = dates.map((item: any) => item.date).includes(time);

  if (dayInCurrentWeek) {
    let namedDay = dayjs(createdAt).format("dddd");

    const currentDate = dayjs().format("DD/MM/YYYY");
    const time = dayjs(createdAt).format("DD/MM/YYYY");
    if (time == currentDate) return "Today";
    return namedDay;
  }
  return null;
}
