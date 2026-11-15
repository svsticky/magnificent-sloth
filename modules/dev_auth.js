const { Menu, MenuItem } = require('electron');
const { CardOn, ClearBasket } = require('./handle_state');

module.exports.HandleAuthDev = async (win, menu) => {
  const submenu = Menu.buildFromTemplate([
    {
      label: 'Products',
      click: () => CardOn(win, process.env.TEST_UUID, process.env.MODULES),
      accelerator: 'Ctrl+1'
    },
    {
      label: 'Idle',
      click: () => {
        ClearBasket();
        win.loadFile('src/views/idle/idle.html')
      },
      accelerator: 'Ctrl+2'
    },
    {
      label: 'Register',
      click: () => {
        ClearBasket();
        win.loadFile('src/views/register/register.html')
      },
      accelerator: 'Ctrl+3'
    },
  ])
  menu.append(new MenuItem({ label: 'Sloth', submenu }))
  Menu.setApplicationMenu(menu)
};
