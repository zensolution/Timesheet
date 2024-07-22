class Font {
    constructor() {
        this.size = 14;
        this.color = "black";
        this.family = "Arial"
        this.fontWeight = "normal"
        this.fontStyle = "normal"
        this.align = "center"
        this.angle = 0
    }

    withSize(size) {
        this.size = size
        return this
    }

    withColor(color) {
        this.color = color
        return this
    }

    withFontWeight(fontWeight) {
        this.fontWeight = fontWeight
        return this
    }

    withFontStyle(fontStyle) {
        this.fontStyle = fontStyle
        return this
    }

    withAlign(align) {
        this.align = align
        return this
    }

    withAngle(angle) {
        this.angle = angle
        return this
    }
}

class RectStyle {
    constructor() {
        this.stroke = "white"
        this.strokeWidth = 0
        this.rx = 0
        this.ry = 0
        this.opacity = 1
    }

    withStroke(stroke) {
        this.stroke = stroke
        return this
    }

    withStrokeWidth(strokeWidth) {
        this.strokeWidth = strokeWidth
        return this
    }

    withRx(rx) {
        this.rx = rx
        return this
    }

    withRy(ry) {
        this.ry = ry
        return this
    }

    withOpacity(opacity) {
        this.opacity = opacity
        return this
    }
}

class VisualProjectPattern {

    constructor() {
        this.projectFont = new Font()
        this.milestoneFont = new Font()
        this.milestoneBlockRectStyle = new RectStyle().withRx(3).withRy(3)
        this.projectRectStyle = new RectStyle().withStrokeWidth(3).withStroke("white")
    }
    withProjectBackground(projectBackground) {
        this.projectBackground = projectBackground
        return this
    }

    withMilestoneBackgroud(milestoneBackground) {
        this.milestoneBackground = milestoneBackground
        return this
    }

    withMilestoneBlockBackgroud(milestoneBlockBackground) {
        this.milestoneBlockBackground = milestoneBlockBackground
        return this
    }
    withProjectFont(font) {
        this.projectFont = font
        return this
    }

    withMilestoneFont(font) {
        this.milestoneFont = font
        return this
    }

    withmilestoneBlockRectStyle(milestoneBlockRectStyle) {
        this.milestoneBlockRectStyle = milestoneBlockRectStyle
        return this
    }

    withProjectRectStyle(projectRectStyle) {
        this.projectRectStyle = projectRectStyle
        return this
    }
}

var YearLabelFont = new Font().withColor("white").withSize(18)
var MonthLabelFont = new Font().withColor("white").withSize(16)
var LabelBackgroud = "#1f3863"
var LabelRectStyle = new RectStyle().withStrokeWidth(1).withStroke("white")

var IndicatorColor = 'lightblue'

var ProjectDisplayPattern = {}

ProjectDisplayPattern['purple'] = new VisualProjectPattern()
    .withProjectBackground("#b17ed9")
    .withMilestoneBackgroud("#ebe1ff")
    .withMilestoneBlockBackgroud("#7030a0")

ProjectDisplayPattern['blue'] = new VisualProjectPattern()
    .withProjectBackground('#bdd6ee')
    .withMilestoneBackgroud("#deeaf6")
    .withMilestoneBlockBackgroud("#4372c4")

ProjectDisplayPattern['pink'] = new VisualProjectPattern()
    .withProjectBackground('lightpink')
    .withMilestoneBackgroud("#FFE0EF")
    .withMilestoneBlockBackgroud("#a35050")

ProjectDisplayPattern['green'] = new VisualProjectPattern()
    .withProjectBackground('#AED296')
    .withMilestoneBackgroud("#EDF5E7")
    .withMilestoneBlockBackgroud("#87BF61")

