// app.js
const API = 'http://localhost:3000/api/artistas';

function qs(s){return document.querySelector(s);}
function qsa(s){return document.querySelectorAll(s);}

// -------------------- HOME --------------------
export async function montarIndex(){
  const destaqueInner=qs('#destaqueCarouselInner');
  const destaqueIndicators=qs('#destaqueIndicators');
  const cardsContainer=qs('#cardsContainer');
  if(!cardsContainer) return;

  let artistas = [];
  try {
    const res = await fetch(API);
    artistas = await res.json();
  } catch(e){
    console.error('Erro ao buscar artistas:', e);
    return;
  }

  // destaques
  if(destaqueInner){
    destaqueInner.innerHTML='';
    destaqueIndicators.innerHTML='';
    const destaques=artistas.filter(a=>a.destaque);
    destaques.forEach((artista,index)=>{
      const div=document.createElement('div');
      div.className='carousel-item'+(index===0?' active':'');
      div.innerHTML=`<img src="${artista.imagem_principal}" class="d-block w-100 slide-imagem" alt="${artista.nome}">
        <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
          <h5>${artista.nome}</h5>
          <p class="mb-0">${artista.descricao}</p>
          <a href="detalhes.html?id=${artista.id}" class="stretched-link text-decoration-none">Ver detalhes</a>
        </div>`;
      destaqueInner.appendChild(div);

      const btn=document.createElement('button');
      btn.type='button';
      btn.setAttribute('data-bs-target','#destaqueCarousel');
      btn.setAttribute('data-bs-slide-to',`${index}`);
      if(index===0) btn.classList.add('active');
      btn.setAttribute('aria-label',`Slide ${index+1}`);
      destaqueIndicators.appendChild(btn);
    });
  }

  // filtros, busca, paginação
  const searchInput=qs('#searchInput');
  const genreFilter=qs('#genreFilter');
  const sortSelect=qs('#sortSelect');
  const pagination=qs('#pagination');
  const pageSize=6;
  let currentPage=1;
  let filtered = artistas.slice();

  // populares generos
  const generos=[...new Set(artistas.map(a=>a.genero))];
  if(genreFilter) genreFilter.innerHTML='<option value="">Filtrar por gênero</option>'+generos.map(g=>`<option value="${g}">${g}</option>`).join('');

  function renderCards(){
    const start=(currentPage-1)*pageSize;
    const pageItems=filtered.slice(start,start+pageSize);
    cardsContainer.innerHTML='';
    pageItems.forEach(artista=>{
      const col=document.createElement('div');
      col.className='col-12 col-sm-6 col-lg-4 mb-4';
      col.innerHTML=`<div class="card card-artista h-100">
        <img src="${artista.imagem_principal}" class="card-img-top" alt="${artista.nome}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${artista.nome}</h5>
          <p class="card-text small text-muted mb-2">${artista.genero} • ${artista.pais}</p>
          <p class="card-text flex-grow-1">${artista.descricao}</p>
          <div class="mt-3">
            <a href="detalhes.html?id=${artista.id}" class="btn btn-sm btn-primary">Ver detalhes</a>
          </div>
        </div>
      </div>`;
      cardsContainer.appendChild(col);
    });
    renderPagination();
  }

  function renderPagination(){
    const totalPages=Math.max(1,Math.ceil(filtered.length/pageSize));
    pagination.innerHTML='';
    for(let i=1;i<=totalPages;i++){
      const li=document.createElement('li');
      li.className='page-item'+(i===currentPage?' active':'');
      li.innerHTML=`<a class="page-link" href="#">${i}</a>`;
      li.addEventListener('click',e=>{e.preventDefault(); currentPage=i; renderCards();});
      pagination.appendChild(li);
    }
  }

  function applyFilters(){
    const q=(searchInput?.value||'').toLowerCase().trim();
    const g=genreFilter?.value;
    filtered=artistas.filter(a=>{
      const matchQ=[a.nome,a.pais,a.genero,a.descricao].join(' ').toLowerCase();
      return matchQ.includes(q) && (g? a.genero===g : true);
    });
    const sort=sortSelect?.value;
    if(sort==='name') filtered.sort((x,y)=>x.nome.localeCompare(y.nome));
    else filtered.sort((x,y)=> new Date(y.data)-new Date(x.data));
    currentPage=1;
    renderCards();
  }

  searchInput?.addEventListener('input',applyFilters);
  genreFilter?.addEventListener('change',applyFilters);
  sortSelect?.addEventListener('change',applyFilters);

  applyFilters();
}

// -------------------- DETALHES --------------------
export async function montarDetalhes(){
  const infoGeral=qs('#info-geral');
  if(!infoGeral) return;
  const params=new URLSearchParams(window.location.search);
  const id=parseInt(params.get('id'),10);
  if(!id){infoGeral.innerHTML='<div class="alert alert-warning">ID do artista não informado na URL.</div>';return;}

  let artista;
  try{
    const res=await fetch(`${API}/${id}`);
    if(!res.ok) throw new Error('Artista não encontrado');
    artista = await res.json();
  } catch(e){
    infoGeral.innerHTML=`<div class="alert alert-danger">${e.message}</div>`;
    return;
  }

  infoGeral.innerHTML=`<div class="row g-4">
    <div class="col-md-5">
      <img src="${artista.imagem_principal}" alt="${artista.nome}" class="detalhe-imagem mb-2">
    </div>
    <div class="col-md-7">
      <h2 class="mb-1">${artista.nome}</h2>
      <p class="text-muted small mb-2">${artista.genero} • ${artista.pais}</p>
      <h5 class="mt-3">Descrição</h5>
      <p>${artista.descricao}</p>
      <h5>Biografia / Conteúdo</h5>
      <p>${artista.conteudo}</p>
    </div>
  </div>`;

  const fotosContainer=qs('#fotosContainer');
  fotosContainer.innerHTML='';
  artista.trabalhos.forEach(trabalho=>{
    const col=document.createElement('div');
    col.className='col-12 col-sm-6 col-md-4 mb-3';
    col.innerHTML=`<div class="card foto-mini h-100">
      <img src="${trabalho.imagem}" class="card-img-top" alt="${trabalho.nome}">
      <div class="card-body">
        <h6 class="card-title mb-1">${trabalho.nome}</h6>
        <p class="card-text small text-muted">${trabalho.descricao}</p>
      </div>
    </div>`;
    fotosContainer.appendChild(col);
  });
}

// -------------------- CADASTRO --------------------
export async function montarCadastro(){
  const form=qs('#formCadastro');
  const msg=qs('#msgSucesso');
  if(!form) return;

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const novoArtista={
      nome: qs('#nome').value,
      descricao: qs('#descricao').value,
      conteudo: qs('#conteudo').value,
      pais: qs('#pais').value,
      genero: qs('#genero').value,
      destaque: false,
      data: new Date().toISOString().split('T')[0],
      imagem_principal: qs('#imagem_principal').value,
      trabalhos: []
    };

    try{
      const res=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(novoArtista)});
      if(!res.ok) throw new Error('Erro ao cadastrar artista');
      form.reset();
      msg.classList.remove('d-none');
      setTimeout(()=>msg.classList.add('d-none'),3000);
    } catch(e){
      alert(e.message);
    }
  });
}

// -------------------- INICIALIZAÇÃO --------------------
document.addEventListener('DOMContentLoaded',()=>{
  montarIndex();
  montarDetalhes();
  montarCadastro();
});
