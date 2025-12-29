export function formatDate(date: Date): string {
	return date.toISOString().split('T')[0];
}

export function parseDate(dateStr: string): Date {
	return new Date(dateStr);
}

export function getWeekDates(startDate: Date): Date[] {
	const dates: Date[] = [];
	for (let i = 0; i < 7; i++) {
		const date = new Date(startDate);
		date.setDate(startDate.getDate() + i);
		dates.push(date);
	}
	return dates;
}

export function getWeekStart(date: Date = new Date()): Date {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day; // Sunday is start of week
	return new Date(d.setDate(diff));
}

export function getWeekEnd(date: Date = new Date()): Date {
	const start = getWeekStart(date);
	const end = new Date(start);
	end.setDate(start.getDate() + 6);
	return end;
}

export function addWeeks(date: Date, weeks: number): Date {
	const d = new Date(date);
	d.setDate(d.getDate() + weeks * 7);
	return d;
}

export function formatWeekRange(startDate: Date, endDate: Date): string {
	const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
	const start = startDate.toLocaleDateString('en-US', options);
	const end = endDate.toLocaleDateString('en-US', options);
	return `${start} - ${end}`;
}

export function getDayName(date: Date): string {
	return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function getShortDayName(date: Date): string {
	return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function getDayAndMonth(date: Date): string {
	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function isToday(date: Date): boolean {
	const today = new Date();
	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
}

export function isSameDay(date1: Date, date2: Date): boolean {
	return (
		date1.getDate() === date2.getDate() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getFullYear() === date2.getFullYear()
	);
}
