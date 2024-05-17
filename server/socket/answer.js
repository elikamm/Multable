module.exports = (client, key, value) => {
    switch (key) {
        case "Guide":       client.Guide();                 break;
        case "Name":        client.SetName(value);          break;
        case "Create":      value = Runtime.Rooms.Add().ID;
        case "Room":        client.SetRoom(value);          break;
        case "Game":        client.SetGame(value);          break;
        case "Setup":       client.SetSetup(value);         break;
        case "Password":    client.CheckSetup(value);       break;
        case "Register":    Runtime.Registers.Add(client);  break;
        case "Revive":      client.Revive(value);
        case "Activate":    client.Activate();              break;

        case "Exist":
            client.Send("Exist", Runtime.Games.Get(value).Exist);
            break;
        case "Games":
            client.Send("Games", Runtime.Games.Search(value));
            break;
        case "Edit":
            client.Send("Edit", Runtime.Games.Edit(value));
            break;
        case "Search":
            client.Send("Search", Runtime.Events.Search(value));
            break;
        case "Debug":
            client.Send("Debug", Runtime.Registers.Debug(value));
            break;

        case "Cursor":  client.Cursor(value);   break;
        case "Press":   client.Press(value);    break;
        case "Click":   client.Click(value);    break;
        case "Drag":    client.Drag(value);     break;
    }
}