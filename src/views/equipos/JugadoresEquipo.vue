<template>
  <v-container
    id="ListarJugadores"
    fluid
    tag="section"
  >
    <v-btn
      fab
      dark
      color="red"
      to="/equipos"
      v-bind="attrs"
      v-on="on"
    >
      <v-icon>mdi-arrow-left-thick</v-icon>
    </v-btn>

    <base-material-card
      id="lista"
      icon="mdi-account-group"
      title="Jugadores Equipo"
      class="px-5 py-3"
    >
      <v-simple-table
        id="tabla"
        fixed-header
        class="elevation-3"
      >
        <thead>
          <tr>
            <th>Fotografia</th>
            <th>Nombre</th>
            <th>Posicion</th>
            <th>Dorsal</th>
            <th>Puntos</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="player in jugadores"
            :key="player.id"
          >
            <td>
              <img
                :src="'http://localhost:30305/photos/' + player.fotografia"
                style="width: 150px; height: 100px"
              >
            </td>
            <td>{{ player.nombre }}</td>
            <td>{{ player.posicion }}</td>
            <td>{{ player.dorsal }}</td>
            <td>{{ player.puntos }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </base-material-card>
  </v-container>
</template>

<script>

  import axios from 'axios'

  import Vue from 'vue'
  import VueSwal from 'vue-swal'
  const url = 'http://localhost:30305/api/'

  Vue.use(VueSwal)

  export default {
    name: '',

    data () {
      return {
        jugadores: {
          id_jugador: '',
          nombre: '',
          fotografia: '',
          puntos: '',
          dorsal: '',
          posicion: '',
        },
      }
    },

    // Traer datos al formulario
    mounted () {
      this.id = this.$route.params.id
      axios.get(url + 'Jugador/EquipoId/' + this.id)
        .then(response => {
          console.log(response)
          this.jugadores = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
  }
</script>
