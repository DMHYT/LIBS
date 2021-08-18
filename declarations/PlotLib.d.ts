/// <reference path="core-engine.d.ts" />
declare namespace PlotLib {
    type PlotsObj = {
        [key: string]: Plot;
    };
    /**All registered plots object FOR INTERNAL USE */
    var plots: PlotsObj;
    class CharacterStory {
        private readonly name;
        private readonly phrases;
    }
    class CharacterDialogue {
        private readonly name;
        private readonly replicas;
        constructor();
    }
    class Character {
        private readonly name;
        private readonly entityUID;
        private readonly entityName;
        private line;
        setLine(line: Line): Character;
        constructor(name: string, entityUID: number, entityName: string);
    }
    class Line {
        private readonly name;
        readonly isNeededForFinal: boolean;
        isCompleted: boolean;
        private plot;
        setPlot(plot: Plot): Line;
        constructor(name: string, isNeededForFinal: boolean);
    }
    class Plot {
        private readonly name;
        private lines;
        constructor(name: string);
        addLine(line: Line): Plot;
    }
}
