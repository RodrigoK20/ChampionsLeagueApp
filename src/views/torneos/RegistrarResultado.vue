<template>
  <v-container>
    <v-row>
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Actualizar resultado partido
        </h1>
      </v-col>
    </v-row>

    <form @submit.prevent="actualizarPartido()">
      <v-col sm="12">
        <v-text-field
          v-model="partido.id_partido_x_torneo"
          hidden
          class="inputRef"
          type="number"
          required
        />

        <v-row no-gutters>
          <v-col md="6">
            <v-text-field
              v-model="partido.equipo_a"
              class="font-weight-black"
              disabled
              shaped
              label="Equipo 1"
              outlined
              required
            />
          </v-col>
          <v-col md="6">
            <v-text-field
              v-model="partido.resultado_a"
              shaped
              type="number"
              label="Resultado "
              outlined
              required
            />
          </v-col>
        </v-row>
      </v-col>
      </v-row>

      <v-col sm="12">
        <v-row no-gutters>
          <v-col md="6">
            <v-text-field
              v-model="partido.equipo_b"
              class="font-weight-black"
              disabled
              shaped
              label="Equipo 2"
              outlined
              required
            />
          </v-col>
          <v-col md="6">
            <v-text-field
              v-model="partido.resultado_b"
              shaped
              type="number"
              label="Resultado "
              outlined
              required
            />
          </v-col>
        </v-row>
      </v-col>
      </v-row>

      <v-card-actions>
        <v-btn
          color="blue-grey"
          to="/torneos"
          class="mr-4"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="green"
          type="submit"
          class="mr-4"
        >
          Actualizar
        </v-btn>
      </v-card-actions>
    </form>
  </v-container>
</template>

<script>

  import axios from 'axios'

  import Vue from 'vue'
  import VueSwal from 'vue-swal'
  const url = 'http://localhost:30305/api/'

  Vue.use(VueSwal)

  export default {
    name: 'EditarEstadio',

    data () {
      return {
        partido: {
          id_partido_x_torneo: '',
          equipo_a: '',
          equipo_b: '',
          resultado_a: '',
          resultado_b: '',
        },
      }
    },

    // Traer datos al formulario
    mounted () {
      this.id = this.$route.params.id

      axios.get(url + 'PartidosTorneo/GetPartido/' + this.id)
        .then(response => {
          console.log(response)
          this.partido = response.data[0]
        })
        .catch((error) => {
          console.log(error)
        })
    },

    methods: {
      actualizarPartido () {
        // para saber que capturamos
        const router = this.$router
        // parametros
        const params = this.partido
        axios.put(url + 'PartidosTorneo/Update/' + this.id, params)
          .then((response) => {
            // alert(response.data);
            if (response.data == 'Actualizado correctamente') {
              this.$swal({
                icon: 'success',
                title: 'Partido actualizado',
                text: 'Resultado ingresado correctamente',
                button: false,
                timer: 3500,
              })

              router.push('/torneos')
              this.partido.equipo_a='',
              this.partido.equipo_b='',
              this.partido.resultado_a='',
              this.partido.resultado_b=''
             
            }

            if (response.data == 'Ingrese correctamente los campos') {
              this.$swal({
                icon: 'error',
                title: 'Error ',
                text: 'Ingrese correctamente los campos',
                button: false,
                timer: 3500,
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },

    },
  }
</script>
