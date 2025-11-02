const dados={"artistas":[{"id":1,"nome":"Ana Silva","descricao":"Cantora e compositora brasileira com repertório MPB e pop.","conteudo":"Ana começou a carreira em festivais locais, possui 3 álbuns, vários singles e turnês pelo Brasil.","pais":"Brasil","genero":"MPB / Pop","destaque":true,"data":"2024-11-10","imagem_principal":"assets/img/artistas/ana_silva.jpg","trabalhos":[{"id":1,"nome":"Clipe 'Noite Clara'","descricao":"Clipe oficial do single de 2023.","imagem":"assets/img/artistas/ana_noite_clara.jpg"},{"id":2,"nome":"Álbum 'Estrada'","descricao":"Álbum de estreia com 10 faixas.","imagem":"assets/img/artistas/ana_estrada.jpg"}]},{"id":2,"nome":"Luca Rossi","descricao":"Produtor e DJ italiano que mistura eletrônico com elementos do jazz.","conteudo":"Reconhecido por sets energéticos e produções para trilhas sonoras.","pais":"Itália","genero":"Eletrônica / Jazz","destaque":false,"data":"2023-08-02","imagem_principal":"assets/img/artistas/luca_rossi.jpg","trabalhos":[{"id":1,"nome":"Set Live - Tomorrow Fest","descricao":"Gravação ao vivo do festival de 2023.","imagem":"assets/img/artistas/luca_live.jpg"}]},{"id":3,"nome":"Maya Johnson","descricao":"Cantora e compositora norte-americana com influências soul e R&B.","conteudo":"Maya possui dois EPs independentes e colaborações com artistas internacionais.","pais":"Estados Unidos","genero":"R&B / Soul","destaque":true,"data":"2025-01-15","imagem_principal":"assets/img/artistas/maya_johnson.jpg","trabalhos":[{"id":1,"nome":"EP 'Blue Hour'","descricao":"EP lançado em 2024 com produção intimista.","imagem":"assets/img/artistas/maya_bluehour.jpg"},{"id":2,"nome":"Sessão Acústica","descricao":"Vídeo acústico com versão ao vivo.","imagem":"assets/img/artistas/maya_acustico.jpg"}]},{"id":4,"nome":"Pedro Carvalho","descricao":"Multi-instrumentista e compositor brasileiro de rock alternativo.","conteudo":"Pedro é destaque na cena independente com composições experimentais.","pais":"Brasil","genero":"Rock Alternativo","destaque":false,"data":"2024-05-22","imagem_principal":"assets/img/artistas/pedro_carvalho.jpg","trabalhos":[{"id":1,"nome":"EP 'Maré'","descricao":"Conjunto de três faixas instrumentais.","imagem":"assets/img/artistas/pedro_mare.jpg"}]},{"id":5,"nome":"Yumi Tanaka","descricao":"Compositora e cantora japonesa que mistura folk e eletrônica.","conteudo":"Yumi explora texturas sonoras e colabora com artistas visuais em shows multimídia.","pais":"Japão","genero":"Folk / Eletrônica","destaque":true,"data":"2025-03-12","imagem_principal":"assets/img/artistas/yumi_tanaka.jpg","trabalhos":[{"id":1,"nome":"Instalação sonora 'Luz e Som'","descricao":"Projeto audiovisual em galeria de arte.","imagem":"assets/img/artistas/yumi_instalacao.jpg"}]}]};

function qs(s){return document.querySelector(s)}
function qsa(s){return document.querySelectorAll(s)}

function montarIndex(){
  const destaqueInner=qs('#destaqueCarouselInner');
  const destaqueIndicators=qs('#destaqueIndicators');
  const cardsContainer=qs('#cardsContainer');
  if(!destaqueInner||!cardsContainer) return;

  const destaques=dados.artistas.filter(a=>a.destaque);
  destaqueInner.innerHTML='';
  destaqueIndicators.innerHTML='';
  destaques.forEach((artista,index)=>{
    const div=document.createElement('div');
    div.className='carousel-item'+(index===0?' active':'');
    div.innerHTML=`<img src="${artista.imagem_principal}" class="d-block w-100 slide-imagem" alt="${artista.nome}"><div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2"><h5>${artista.nome}</h5><p class="mb-0">${artista.descricao}</p><a href="detalhe.html?id=${artista.id}" class="stretched-link text-decoration-none">Ver detalhes</a></div>`;
    destaqueInner.appendChild(div);
    const btn=document.createElement('button');
    btn.setAttribute('type','button');
    btn.setAttribute('data-bs-target','#destaqueCarousel');
    btn.setAttribute('data-bs-slide-to',`${index}`);
    if(index===0) btn.classList.add('active');
    btn.setAttribute('aria-label',`Slide ${index+1}`);
    destaqueIndicators.appendChild(btn);
  });

  // filtro e busca
  const searchInput=qs('#searchInput');
  const genreFilter=qs('#genreFilter');
  const sortSelect=qs('#sortSelect');
  const pagination=qs('#pagination');
  const pageSize=6;
  let currentPage=1;
  let filtered=dados.artistas.slice();

  // popular opcoes de genero
  const generos=[...new Set(dados.artistas.map(a=>a.genero))];
  genreFilter.innerHTML='<option value="">Filtrar por gênero</option>'+generos.map(g=>`<option value="${g}">${g}</option>`).join('');

  function renderCards(){
    const start=(currentPage-1)*pageSize;
    const pageItems=filtered.slice(start,start+pageSize);
    cardsContainer.innerHTML='';
    pageItems.forEach(artista=>{
      const col=document.createElement('div');
      col.className='col-12 col-sm-6 col-lg-4 mb-4';
      col.innerHTML=`<div class="card card-artista h-100"><img src="${artista.imagem_principal}" class="card-img-top" alt="${artista.nome}"><div class="card-body d-flex flex-column"><h5 class="card-title">${artista.nome}</h5><p class="card-text small text-muted mb-2">${artista.genero} • ${artista.pais}</p><p class="card-text flex-grow-1">${artista.descricao}</p><div class="mt-3"><a href="detalhe.html?id=${artista.id}" class="btn btn-sm btn-primary">Ver detalhes</a></div></div></div>`;
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
      li.addEventListener('click',function(e){e.preventDefault();currentPage=i;renderCards();});
      pagination.appendChild(li);
    }
  }

  function applyFilters(){
    const q=(searchInput.value||'').toLowerCase().trim();
    const g=genreFilter.value;
    filtered=dados.artistas.filter(a=>{
      const matchQ=[a.nome,a.pais,a.genero,a.descricao].join(' ').toLowerCase();
      return matchQ.includes(q) && (g? a.genero===g : true);
    });
    const sort=sortSelect.value;
    if(sort==='name') filtered.sort((x,y)=>x.nome.localeCompare(y.nome));
    else filtered.sort((x,y)=> new Date(y.data) - new Date(x.data));
    currentPage=1;
    renderCards();
  }

  searchInput.addEventListener('input',applyFilters);
  genreFilter.addEventListener('change',applyFilters);
  sortSelect.addEventListener('change',applyFilters);

  applyFilters();
}

function montarDetalhes(){
  const infoGeral=qs('#info-geral');
  if(!infoGeral) return;
  const params=new URLSearchParams(window.location.search);
  const id=parseInt(params.get('id'),10);
  if(!id){infoGeral.innerHTML='<div class="alert alert-warning">ID do artista não informado na URL. Use ?id=1.</div>';return;}
  const artista=dados.artistas.find(a=>a.id===id);
  if(!artista){infoGeral.innerHTML=`<div class="alert alert-danger">Artista não encontrado (id=${id}).</div>`;return;}
  infoGeral.innerHTML=`<div class="row g-4"><div class="col-md-5"><img src="${artista.imagem_principal}" alt="${artista.nome}" class="detalhe-imagem mb-2"><div class="d-flex gap-2"><a href="#" class="btn btn-sm btn-outline-primary">Site</a><a href="#" class="btn btn-sm btn-outline-secondary">YouTube</a></div></div><div class="col-md-7"><h2 class="mb-1">${artista.nome}</h2><p class="text-muted small mb-2">${artista.genero} • ${artista.pais} • Referência: ${artista.data}</p><h5 class="mt-3">Descrição</h5><p>${artista.descricao}</p><h5>Biografia / Conteúdo</h5><p>${artista.conteudo}</p><h6 class="mt-3">Detalhes adicionais</h6><ul><li><strong>Gênero:</strong> ${artista.genero}</li><li><strong>País:</strong> ${artista.pais}</li><li><strong>Data de referência:</strong> ${artista.data}</li><li><strong>Quantidade de trabalhos vinculados:</strong> ${artista.trabalhos.length}</li><li><strong>Observações:</strong> Este layout é personalizado com 5+ campos.</li></ul></div></div>`;
  const fotosContainer=qs('#fotosContainer');
  fotosContainer.innerHTML='';
  artista.trabalhos.forEach(trabalho=>{
    const col=document.createElement('div');
    col.className='col-12 col-sm-6 col-md-4 mb-3';
    col.innerHTML=`<div class="card foto-mini h-100"><img src="${trabalho.imagem}" class="card-img-top" alt="${trabalho.nome}"><div class="card-body"><h6 class="card-title mb-1">${trabalho.nome}</h6><p class="card-text small text-muted">${trabalho.descricao}</p></div></div>`;
    fotosContainer.appendChild(col);
  });
}

document.addEventListener('DOMContentLoaded',function(){montarIndex();montarDetalhes();});
