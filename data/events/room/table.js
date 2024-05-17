_["style"] = {
    Info: "change appearance..",
    Args: { design: "design" },
    Code: (engine, design) => {
        let room = engine.Room,
            style = design[1];
        room.Table.Style = style;
        room.Cast("Style", style, 2);
        return ["null"];
    }
}