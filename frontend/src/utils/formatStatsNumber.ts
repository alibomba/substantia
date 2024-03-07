function formatStatsNumber(num: number): string {
    if (num < 1000) {
        return num.toString();
    } else if (num < 1000000) {
        const k = num / 1000;
        return k % 1 === 0 ? k.toFixed() + "k" : Math.floor(k * 10) / 10 + "k";
    } else if (num < 1000000000) {
        const m = num / 1000000;
        return m % 1 === 0 ? m.toFixed() + "M" : Math.floor(m * 10) / 10 + "M";
    } else {
        const b = num / 1000000000;
        return b % 1 === 0 ? b.toFixed() + "B" : Math.floor(b * 10) / 10 + "B";
    }
}

export default formatStatsNumber;