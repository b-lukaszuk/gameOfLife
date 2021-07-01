/**
 * tests if a number is between other two numbers
 */
function isBetween(testedNum: number,
    lowerIncl: number, upperIncl: number): boolean {
    return (testedNum >= lowerIncl) && (testedNum <= upperIncl);
}

export default isBetween;
