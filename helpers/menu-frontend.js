const getMenuFrontEnd = (role = 'USER_ROLE') => {
	const menu = [
		{
			titulo: 'Principal',
			icono: 'mdi mdi-gauge',
			submenu: [
				{
					titulo: 'Main',
					url: '/',
				},
				{
					titulo: 'ProgressBar',
					url: 'progress',
				},
				{
					titulo: 'Promesas',
					url: 'promises',
				},
				{
					titulo: 'Rxjs',
					url: 'rxjs',
				},
				{
					titulo: 'Gráficas',
					url: 'charts',
				},
			],
		},
		{
			titulo: 'Mantenimiento',
			icono: 'mdi mdi-folder-lock-open',
			submenu: [
				//{		titulo: 'Usuarios',	url: 'usuarios',},
				{
					titulo: 'Hospitales',
					url: 'hospitales',
				},
				{
					titulo: 'Medicos',
					url: 'medicos',
				},
			],
		},
	];

	if (role === 'ADMIN_ROLE') {
		menu[1].submenu.unshift({
			titulo: 'Usuarios',
			url: 'usuarios',
		});
	}

	return menu;
};

module.exports = { getMenuFrontEnd };
