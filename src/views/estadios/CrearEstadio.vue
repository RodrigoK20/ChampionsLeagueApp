<template>
  <v-container>
    <v-row>
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Crear estadio
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <form @submit.prevent="guardarEstadio()">
          <v-text-field
            v-model="estadio.nombre_estadio"
            autofocus
            label="Nombre"
            outlined="outlined"
            required="required"
          />

          <v-text-field
            v-model="estadio.pais"
            label="Pais"
            type="text"
            outlined="outlined"
            required="required"
          />

          <v-text-field
            v-model="estadio.ciudad"
            label="Ciudad"
            type="text"
            outlined="outlined"
            required="required"
          />

          <v-card-actions>
            <v-btn
              color="blue-grey"
              to="/estadios"
              class="mr-4"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="indigo"
              type="submit"
              class="mr-4"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Aca ingreso la url de la API para guardar un articulo
  import axios from 'axios'

  import Vue from 'vue'
  import VueSwal from 'vue-swal'
  const url = 'http://localhost:30305/api/'

  Vue.use(VueSwal)

  export default {
    name: 'CrearEstadio',
    data () {
      return {
        // Creando un objeto de estadio, que contiene los datos correspondientes
        estadio: {
          nombre_estadio: '',
          pais: '',
          ciudad: '',
        },
      }
    },

    methods: {
      guardarEstadio () {
        // para saber que capturamos desde el navegador
        const router = this.$router
        // parametros del objeto Articulo
        const params = this.estadio
        axios
          .post(url + 'Estadio/Add', params)
          .then((response) => {
            // Obteniendo valor del response (count es un alias)
            console.log(response)
            // this.articulo=response.data[0]; console.log(response.data[0].count > 0);
            // Validacion
            // eslint-disable-next-line eqeqeq
            if (response.status == 200) {
              console.log('status 200')

              this.$swal({
                icon: 'success',
                title: 'Estadio registrado',
                text: 'Guardado en la base de datos',
                showConfirmButton: false,
                timer: 1500,
              })

              router.push('/estadios')
            }

            // eslint-disable-next-line eqeqeq
            if (response.status == 201) {
              this.$swal({
                icon: 'warning',
                title: 'Articulo duplicado',
                text: 'El articulo que desea ingresar ya se encuentra registrado!',
                showConfirmButton: false,
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
