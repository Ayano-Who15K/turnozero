// ========================================
        // PARÂMETROS EDITÁVEIS - ALTERE AQUI
        // ========================================
        
        // Para alterar o número do WhatsApp, substitua pelos dígitos do seu número
        // Formato: código do país + DDD + número (somente números)
        // Exemplo: 5511999887766 para +55 (11) 99988-7766
        const WHATSAPP_NUMERO = '5548996868430';
        
        const VALOR_MINIMO = 50; // Valor mínimo em reais
        
        // ========================================
        // CATÁLOGO DE PRODUTOS
        // ========================================
        const produtos = [
            {
                id: 'brahma-dm-350',
                nome: 'Brahma Duplo Malte Lata 350ml',
                precoBase: 4.99,
                imagem: '../../assets/img/cervejaslata/brahmaduplomaltelata.png'
            },
            {
                id: 'bud-lata-350',
                nome: 'Budweiser Lata 350ml',
                precoBase: 5.49,
                imagem: '../../assets/img/cervejaslata/BudweiserLata.png'
            },
            
        ];

        // ========================================
        // FUNÇÕES UTILITÁRIAS
        // ========================================

        /**
         * Formata um número para o formato de moeda brasileira
         * @param {number} valorNumber - Valor numérico
         * @returns {string} - Valor formatado (ex: "R$ 1.234,56")
         */
        function formatarBRL(valorNumber) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(valorNumber);
        }

        /**
         * Converte string BRL para número
         * @param {string} str - String no formato "R$ 1.234,56"
         * @returns {number} - Valor numérico (ex: 1234.56)
         */
        function parseBRL(str) {
            if (!str) return 0;
            // Remove tudo exceto números, vírgula e ponto
            const cleanStr = str.replace(/[^\d,]/g, '');
            // Substitui vírgula por ponto para conversão
            const numberStr = cleanStr.replace(',', '.');
            return parseFloat(numberStr) || 0;
        }

        /**
         * Monta a mensagem para o WhatsApp
         * @param {string} nomeProduto - Nome do produto
         * @param {string} valorBRLString - Valor formatado em BRL
         * @returns {string} - Mensagem formatada
         */
        function montarMensagem(nomeProduto, valorBRLString) {
            return `Olá! Quero investir no produto: ${nomeProduto}

Valor do investimento: ${valorBRLString}

Confere a disponibilidade e próximos passos?`;
        }

        /**
         * Gera o link do WhatsApp
         * @param {string} mensagem - Mensagem a ser enviada
         * @returns {string} - URL do WhatsApp
         */
        function gerarLinkWhatsApp(mensagem) {
            return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
        }

        /**
         * Aplica máscara de moeda brasileira em tempo real
         * @param {HTMLInputElement} input - Campo de input
         */
        function aplicarMascaraBRL(input) {
            let valor = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito
            
            if (valor === '') {
                input.value = '';
                return;
            }
            
            // Converte para centavos
            valor = parseInt(valor) / 100;
            
            // Formata como moeda
            input.value = formatarBRL(valor);
        }

        /**
         * Valida se o valor está dentro do mínimo permitido
         * @param {number} valor - Valor a ser validado
         * @returns {boolean} - True se válido
         */
        function validarValorMinimo(valor) {
            return valor >= VALOR_MINIMO;
        }

        /**
         * Exibe mensagem de erro
         * @param {string} produtoId - ID do produto
         * @param {string} mensagem - Mensagem de erro
         */
        function exibirErro(produtoId, mensagem) {
            const errorElement = document.querySelector(`#error-${produtoId}`);
            if (errorElement) {
                errorElement.textContent = mensagem;
                errorElement.style.display = 'block';
            }
        }

        /**
         * Oculta mensagem de erro
         * @param {string} produtoId - ID do produto
         */
        function ocultarErro(produtoId) {
            const errorElement = document.querySelector(`#error-${produtoId}`);
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }

        // ========================================
        // FUNÇÃO PRINCIPAL DE INVESTIMENTO
        // ========================================

        /**
         * Processa o investimento em um produto
         * @param {string} produtoId - ID do produto
         */
        function onInvestir(produtoId) {
            // Encontra o produto
            const produto = produtos.find(p => p.id === produtoId);
            if (!produto) {
                alert('Produto não encontrado!');
                return;
            }

            // Pega o valor do input
            const inputElement = document.querySelector(`#valor-${produtoId}`);
            const valorString = inputElement.value;
            const valor = parseBRL(valorString);

            // Oculta erros anteriores
            ocultarErro(produtoId);

            // Valida valor mínimo
            if (!validarValorMinimo(valor)) {
                exibirErro(produtoId, `Valor mínimo para investimento é ${formatarBRL(VALOR_MINIMO)}`);
                inputElement.focus();
                return;
            }

            // Monta a mensagem
            const mensagem = montarMensagem(produto.nome, formatarBRL(valor));
            
            // Gera o link do WhatsApp
            const linkWhatsApp = gerarLinkWhatsApp(mensagem);
            
            // Abre o WhatsApp
            try {
                window.open(linkWhatsApp, '_blank');
            } catch (error) {
                // Fallback para dispositivos que podem ter problemas
                console.error('Erro ao abrir WhatsApp:', error);
                // Tenta abrir na mesma janela como fallback
                window.location.href = linkWhatsApp;
            }
        }

        // ========================================
        // RENDERIZAÇÃO DOS PRODUTOS
        // ========================================

        /**
         * Renderiza um card de produto
         * @param {Object} produto - Objeto do produto
         * @returns {string} - HTML do card
         */
        function renderizarProduto(produto) {
            return `
                <div class="product-card">
                    <img src="${produto.imagem}" alt="${produto.nome}" class="product-image" loading="lazy">
                    <div class="product-info">
                        <h3 class="product-name">${produto.nome}</h3>
                        <p class="product-price">A partir de ${formatarBRL(VALOR_MINIMO)}</p>
                        
                        <div class="investment-section">
                            <div class="input-group">
                                <label for="valor-${produto.id}" class="input-label">
                                    Quanto você quer investir?
                                </label>
                                <input 
                                    type="text" 
                                    id="valor-${produto.id}"
                                    class="currency-input"
                                    placeholder="${formatarBRL(VALOR_MINIMO)}"
                                    aria-describedby="error-${produto.id}"
                                >
                                <div id="error-${produto.id}" class="error-message" role="alert"></div>
                            </div>
                            
                            <button 
                                class="invest-btn" 
                                onclick="onInvestir('${produto.id}')"
                                aria-label="Investir em ${produto.nome}"
                            >
                                💰 Investir Agora
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        /**
         * Renderiza todos os produtos na grid
         */
        function renderizarProdutos() {
            const grid = document.getElementById('products-grid');
            if (!grid) return;

            grid.innerHTML = produtos.map(produto => renderizarProduto(produto)).join('');

            // Adiciona event listeners para as máscaras de moeda
            produtos.forEach(produto => {
                const input = document.querySelector(`#valor-${produto.id}`);
                if (input) {
                    input.addEventListener('input', function() {
                        aplicarMascaraBRL(this);
                        ocultarErro(produto.id);
                    });

                    input.addEventListener('focus', function() {
                        if (this.value === '') {
                            this.value = formatarBRL(VALOR_MINIMO);
                            // Move cursor para o final
                            setTimeout(() => {
                                this.setSelectionRange(this.value.length, this.value.length);
                            }, 0);
                        }
                    });
                }
            });
        }

        // ========================================
        // MODAL FUNCTIONS
        // ========================================

        function openModal() {
            document.getElementById('modal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            document.getElementById('modal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Fecha modal ao clicar fora
        document.addEventListener('click', function(event) {
            const modal = document.getElementById('modal');
            if (event.target === modal) {
                closeModal();
            }
        });

        // Fecha modal com ESC
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });

        // ========================================
        // INICIALIZAÇÃO
        // ========================================

        // Renderiza os produtos quando a página carrega
        document.addEventListener('DOMContentLoaded', function() {
            renderizarProdutos();
            
            // Log para debug (pode ser removido em produção)
            console.log('Sistema de investimento carregado!');
            console.log(`WhatsApp configurado para: ${WHATSAPP_NUMERO}`);
            console.log(`Valor mínimo: ${formatarBRL(VALOR_MINIMO)}`);
            });