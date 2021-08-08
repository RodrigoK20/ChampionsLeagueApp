<template>
  <v-container>
    <v-row
      justify="center"
      align="center"
    >
      <v-col
        cols="12"
        md="6"
      >
        <base-material-card
          class="v-card-profile text-center"
          tile
        >
          <v-avatar
            size="250"
          >
            <img
              :src="'http://localhost:30305/photos/' + jugador.fotografia"
              style="width: 280px; height: 300px"

              fab
            >
          </v-avatar>

          <v-card-text class="text-center">
            <h2>Futbolista profesional</h2>
            <br>
            <h4 class="display-2 font-weight-light mb-3 black--text">
              Nombre: {{ jugador.nombre }}
            </h4>

            <h4 class="display-2 font-weight-light mb-3 black--text">
              Posición: {{ jugador.posicion }}
            </h4>

            <h4 class="display-2 font-weight-light mb-3 black--text">
              Dorsal: {{ jugador.dorsal }}
            </h4>

            <h4 class="display-2 font-weight-light mb-3 black--text">
              Edad: {{ edad }}
            </h4>

            <h4 class="display-2 font-weight-light mb-3 black--text">
              Equipo: {{ jugador.nombre_equipo }}
            </h4>

            <v-btn
              color="warning"
              to="/jugadores"
              rounded
              class="mr-0"
            >
              Regresar
            </v-btn>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
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
        edad: '',
        jugador: {
          id_jugador: '',
          nombre: '',
          fotografia: '',
          puntos: '',
          dorsal: '',
          posicion: '',
          nombre_equipo: '',
          fecha_nac: '',
          edad: '',
        },
      }
    },

    // Traer datos al formulario
    mounted () {
      this.id = this.$route.params.id
      axios.get(url + 'Jugador/Player/' + this.id)
        .then(response => {
          console.log(response)
          this.jugador = response.data[0]
          this.edad = getAge(this.jugador.fecha_nac)
        })
        .catch((error) => {
          console.log(error)
        })
    },
  }

  // Calcular edad con fecha de nacimiento
  function getAge (dateString) {
    var today = new Date()
    var birthDate = new Date(dateString)
    var age = today.getFullYear() - birthDate.getFullYear()
    var m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }
</script>
