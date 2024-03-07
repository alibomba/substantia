function calculatePercentage(number: number, fraction: number): number {
    const percentage = (fraction / number) * 100;
    return Math.round(percentage);
}

export default calculatePercentage;