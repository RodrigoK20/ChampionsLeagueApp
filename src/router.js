import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/dashboard/Dashboard'),
        },
        // Listar Estadios
        {
          name: 'ListarEstadios',
          path: '/estadios',
          component: () => import('@/views/estadios/ListarEstadios'),

        },

        // Crear Estadio
        {
          name: 'CrearEstadio',
          path: '/crear',
          component: () => import('@/views/estadios/CrearEstadio'),

        },

        // Editar Estadio
        {
          name: 'EditarEstadio',
          path: '/editar',
          component: () => import('@/views/estadios/EditarEstadio'),

        },

        // Listar Equipos
        {
          name: '',
          path: '/equipos',
          component: () => import('@/views/equipos/ListarEquipos'),

        },

       // Crear Equipo
       {
        name: '',
        path: '/creareq',
        component: () => import('@/views/equipos/CrearEquipo'),

      },
      // Listar Jugadores
        {
          name: '',
          path: '/jugadores',
          component: () => import('@/views/jugadores/ListarJugadores'),

        },
          // Listar Jugadores
          {
            name: 'JugadoresEquipo',
            path: '/equipo/jugadores',
            component: () => import('@/views/equipos/JugadoresEquipo'),

          },

         // Detalle Jugador
          {
            name: 'DetalleJugador',
            path: '/jugador/detalle',
            component: () => import('@/views/jugadores/DetallesJugador'),

          },
         // Listar Torneos
         {
            name: 'Torneos',
            path: '/torneos',
            component: () => import('@/views/torneos/ListarTorneos'),

         },

         // Registrar Equipos Torneos
         {
            name: 'RegistrarEquipos',
            path: '/torneos/equipos',
            component: () => import('@/views/torneos/RegistrarEquipos'),

         },

        // Registrar Partidos  por torneo
         {
            name: 'RegistrarPartidos',
            path: '/torneos/partidos',
            component: () => import('@/views/torneos/PartidosTorneo'),

         },
         // Listar Partidos Torneo
         {
            name: 'ListarPartidosTorneo',
            path: '/partidos',
            component: () => import('@/views/torneos/ListarPartidosTorneo'),

         },
          // Listar Partidos Torneo
         {
            name: 'RegistrarResultadoPartidoTorneo',
            path: '/resultado',
            component: () => import('@/views/torneos/RegistrarResultado'),

         },
        // Pages
        {
          name: 'User Profile',
          path: 'pages/user',
          component: () => import('@/views/dashboard/pages/UserProfile'),
        },
        {
          name: 'Notifications',
          path: 'components/notifications',
          component: () => import('@/views/dashboard/component/Notifications'),
        },
        {
          name: 'Icons',
          path: 'components/icons',
          component: () => import('@/views/dashboard/component/Icons'),
        },
        {
          name: 'Typography',
          path: 'components/typography',
          component: () => import('@/views/dashboard/component/Typography'),
        },
        // Tables
        {
          name: 'Regular Tables',
          path: 'tables/regular-tables',
          component: () => import('@/views/dashboard/tables/RegularTables'),
        },
        // Maps
        {
          name: 'Google Maps',
          path: 'maps/google-maps',
          component: () => import('@/views/dashboard/maps/GoogleMaps'),
        },
        // Upgrade
        {
          name: 'Upgrade',
          path: 'upgrade',
          component: () => import('@/views/dashboard/Upgrade'),
        },
      ],
    },
  ],
})
