<template>

    <v-container>

        <v-row>
            <v-col class="mb-4">
                <h1 class="display-2 font-weight-bold mb-3">Alta de artículos</h1>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <form v-on:submit.prevent="guardarArticulo()">
                  <v-text-field
                     v-model="articulo.descripcion"
                     label="Descripción"
                     outlined
                     required
                     ></v-text-field>

                    <v-text-field
                     v-model="articulo.precio"
                     label="Precio"
                     type="number"
                     prefix="$"
                     outlined
                     required
                     ></v-text-field>

                      <v-text-field
                     v-model="articulo.stock"
                     label="Stock"
                     type="number"
                     outlined
                     required
                     ></v-text-field>
                     

                

                <v-card-actions>
                    <v-btn color="blue-grey" to="/articulos" class="mr-4">Cancelar</v-btn>
                    <v-btn color="indigo" type="submit" class="mr-4">Guardar</v-btn>
                </v-card-actions>

            </form>

            </v-col>
        </v-row>

    </v-container>
     
</template>

<script>


let url = 'http://localhost:3000/api/articulos/';
import axios from 'axios';

export default {
    name: 'CrearArticulo',
    data(){
        return{
        articulo:{
            descripcion:'',
            precio:'',
            stock:''
            }
        };
    },

    methods:{
        guardarArticulo(){
            //para saber que capturamos
            let router = this.$router;
            //parametros
            let params = this.articulo;
            axios.post(url, params)
            .then(()=>{
                router.push('/articulos');
            })
            .catch((error)=>{
                console.log(error);
            })

        }
    }
    
}
</script>
