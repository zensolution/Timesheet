class DateRange {
    constructor(startDate, endDate) {
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
    }

    getMonths() {
        const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var months = []
        var date = new Date(this.startDate)
        date.setDate(1)
        while (date <= this.endDate) {
            months.push({
                year: date.getFullYear(),
                month: date.getMonth(),
                monthDesc: monthShortNames[date.getMonth()]
            })
            if (date.getMonth() != 11) {
                date.setMonth(date.getMonth() + 1)
            } else {
                date.setFullYear(date.getFullYear() + 1)
                date.setMonth(0)
            }
        }
        return months
    }

    getYearMap() {
        var months = this.getMonths()
        const yearMap = new Map()
        for (let i = 0; i < months.length; i++) {
            var year = months[i].year
            if (yearMap.has(year)) {
                yearMap.set(year, yearMap.get(year) + 1)
            } else {
                yearMap.set(year, 1)
            }
        }
        return yearMap
    }

    getPositionPercentage(date) {
        var months = this.getMonths()
        var index = 0;
        for (; index < months.length; index++) {
            var month = months[index]
            if (month.year === date.getFullYear() && month.month === date.getMonth()) {
                break;
            }
        }
        return index / months.length + date.getDate() / this.daysInMonth(date.getFullYear(), date.getMonth()) / months.length
    }

    daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }
}

let isString = value => typeof value === 'string' || value instanceof String;

class DrawingUtl {

    drawTriangle(left, top, angle=180) {
        const triangle = new fabric.Triangle({
            width: 10,
            height: 10,
            fill: LabelBackgroud,
            stroke: 'black',
            strokeWidth: 1,
            left: left,
            top: top,
            angle: angle
        });
        return triangle
    }

    drawRect(left, top, width, height, background, rectStyle) {
        var rect = new fabric.Rect({
            left: left,
            top: top,
            width: width,
            height: height,
            fill: background,
            strokeWidth: rectStyle.strokeWidth,
            stroke: rectStyle.stroke,
            rx: rectStyle.rx === undefined ? 0 : rectStyle.rx,
            rx: rectStyle.ry === undefined ? 0 : rectStyle.ry,
            opacity: rectStyle.opacity
        });
        return rect
    }

    drawText(text, top, left, width, height, font, textAlign = "center") {
        var virtualText = new fabric.Textbox(text + "", {
            left: left,
            top: top,
            fontSize: font.size,
            fontFamily: font.family,
            textAlign: font.align,
            fill: font.color,
            width: width,
            height: height,
            angle: font.angle
        });

        var finalText = new fabric.Textbox(text + "", {
            left: left,
            top: top + (height - virtualText.getScaledHeight()) / 2,
            fontSize: font.size,
            fontFamily: font.family,
            fill: font.color,
            width: width,
            textAlign: textAlign,
            angle: font.angle
        });
        return finalText
    }

    drawMarker(text, top, left, font) {
        var finalText = new fabric.Textbox(text + "", {
            left: left,
            top: top,
            fontSize: font.size,
            fontFamily: font.family,
            width: 200,
            fill: font.color,
            angle: font.angle
        });
        return finalText
    }

    drawline(top, left, height, color, stokeWidth, dashArray) {
        return new fabric.Line([left, top, left, top + height], {
            left: left,
            top: top,
            stroke: color,
            strokeWidth: stokeWidth,
            strokeDashArray: dashArray
        });
    }

    measureHeight(text, font, canvas) {
        const ctx = canvas.getContext('2d');
        const measure = ctx.measureText(text, font.size + 'px ' + font.family)
        return measure.fontBoundingBoxAscent
    }

    measureWidth(text, font) {
        var test = document.getElementById("Test");
        test.style.fontSize = font.size;
        test.style.fontFamily = font.family
        test.innerText = text
        return test.clientWidth;
    }
}