const hbs = require('hbs');
const fs = require('fs');
listaCursos = [];
listaUsuarios = [];
listaCxU = [];

const listarC = () => {
    try {
        listaCursos = require('../../cursos.json')
    } catch (error) {
        listaCursos = [];
    }
}

const listarU = () => {
    try {
        listaUsuarios = require('../../usuarios.json')
    } catch (error) {
        listaUsuarios = [];
    }
}

const listarCxU = () => {
    try {
        listaCxU = require('../../CursoxUsuario.json')
    } catch (error) {
        listaCxU = [];
    }
}

const guardarC = () => {
    let datos = JSON.stringify(listaCursos);
    fs.writeFile('cursos.json', datos, (err) => {
        if (err) throw (err);
        console.log('Cursos guardados con exito')
    })
}

const guardarU = () => {
    let datos = JSON.stringify(listaUsuarios);
    fs.writeFile('usuarios.json', datos, (err) => {
        if (err) throw (err);
        console.log('Usuarios guardados con exito')
    })
}

const guardarCxU = () => {
    let datos = JSON.stringify(listaCxU);
    fs.writeFile('CursoxUsuario.json', datos, (err) => {
        if (err) throw (err);
        console.log('Cursos por usuario guardados con exito')
    })
}

const crearC = (curso) => {

    listarC();
    let curs = {
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        modalidad: curso.modalidad,
        id: curso.id,
        valor: curso.valor,
        intensidad: curso.intensidad,
        estado: 'Disponible'

    };
    let duplicado = listaCursos.find(cur => cur.id == curso.id)
    if (!duplicado) {
        listaCursos.push(curs);
        console.log(listaCursos);
        guardarC();

    } else
        console.log('Ya existe otro curso con este id');

}

const crearU = (user) => {
    listarC();
    listarU();
    listarCxU();
    let us = {
        documento: user.documento,
        correo: user.correo,
        nombre: user.nombre,
        telefono: user.telefono,

    };

    let userPerCourse = {
        documento: user.documento,
        curso: ((user.curso).split('---'))[0]
    };
    console.log(userPerCourse.curso)
    let duplicado = listaUsuarios.find(use => use.documento == user.documento)
    if (!duplicado) {
        listaUsuarios.push(us);
        guardarU();
        listaCxU.push(userPerCourse);
        guardarCxU();
        console.log("Se crea usuario con exito y se registra en el curso")
    } else {
        let cursoduplicado = listaCxU.find(cpu => (cpu.curso == userPerCourse.curso && cpu.documento == userPerCourse.documento))
        if (!cursoduplicado) {
            listaCxU.push(userPerCourse);
            guardarCxU();
            console.log('Ya existe el usuario con este id registrado,Pero se registra en el curso')
        } else {
            console.log('Ya existe el usuario con este id registrado y con este curso registrado');
        }
    }


}


hbs.registerHelper('listaCursos', () => {
    listarC();
    text = ""
    let disponibles = listaCursos.filter(curs => curs.estado == 'Disponible');
    if (disponibles.length == 0) {
        text = ""
    } else {
        disponibles.forEach(cur => {
            text = text + `
            <option id='${cur.id}'>${cur.id}---${cur.nombre}</option>
        `})

    }
    console.log(text)
    return text;

})

hbs.registerHelper('listarCDisponibles', () => {
    listarC();
    let text = '<div class="accordion" id="accordionExample">';
    let i = 1;
    let disponibles = listaCursos.filter(curs => curs.estado == 'Disponible');
    if (disponibles.length == 0) {
        text = "<p>No se han registrado Cursos</p>"
    } else {
        disponibles.forEach(cur => {
            text = text +
                `<div class="card">
             <div class="card-header" id="heading${i}">
               <h2 class="mb-0">
                 <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                 Nombre de el curso: ${cur.nombre}<br> 
                 Descripcion del curso: ${cur.descripcion}<br>
                 Valor del Curso: ${cur.valor}<br>
                 </button>
               </h2>
             </div>
         
             <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
               <div class="card-body">
               Descripcion del curso: ${cur.descripcion}<br>
               Modalidad del curso: ${cur.modalidad}<br>
               Intensidad del Curso: ${cur.intensidad} <br> 
    
               </div>
             </div>
             </div>
        `
            i++;
        });
    }
    text = text + '</div>'
    return text;

});

hbs.registerHelper('gestionarCurso', () => {
    listarC();
    listarU();

    let text = '<div class="accordion" id="accordionExample">';
    let i = 1;
    listaCursos.forEach(x => {
        personas = personasEnCurso(x);
        text = text +
            `<div class="card">
        <div class="card-header" id="heading${i}">
          <h2 class="mb-0">
            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
            Nombre de el curso: ${x.nombre}<br> 
            </button>
          </h2>
        </div>
    
        <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
          <div class="card-body">
          ${personas}
          </div>
        </div>
        </div>
   `
        i++;
    });

    return text + '</div>';
});

const personasEnCurso = (curso) => {

    listarCxU();
    listarU();
    let inscritos = listaCxU.filter(pers => pers.curso == curso.id);
    resultado = `<table class="table">
    <thead class="thead-dark">
      <tr>
        <th scope="col">#</th>
        <th scope="col">Nombre</th>
        <th scope="col">Id</th>
        <th scope="col">Accion</th>
      </tr>
    </thead>
    <tbody>`
    i = 1;
    inscritos.forEach(curxx => {
        let persona = listaUsuarios.filter(perx => curxx.documento == perx.documento);
        resultado = resultado +
            `<tr>
            <th scope="row">${i}</th>
            <td>${persona[0].nombre}</td>
            <td>${persona[0].documento}</td>
            <td><button type="button" class="btn btn-danger">Eliminar</button></td>
          </tr>`
        i++;

    });
    resultado = resultado + `</tbody>
    </table>`

    return resultado;
}
module.exports = {
    crearC,
    crearU
}