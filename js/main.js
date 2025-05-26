// js/main.js
document.addEventListener('DOMContentLoaded', function() {

    // Datos de los temas de la comunidad
    const COMMUNITY_TOPICS_DATA = [
        { id: 1, avatar: "JS", bgColor: "#0073b1", titleKey: "communityTopic1Title", author: "Juan Solano", timeKey: "communityTime1", replies: 15, link: "#" },
        { id: 2, avatar: "LM", bgColor: "#28a745", titleKey: "communityTopic2Title", author: "Liss Mozombite", timeKey: "communityTime2", replies: 8, link: "#" },
        { id: 3, avatar: "CP", bgColor: "#dc3545", titleKey: "communityTopic3Title", author: "Cesia Pintado", timeKey: "communityTime3", replies: 22, link: "#" },
        { id: 4, avatar: "ML", bgColor: "#ffc107", textColor: "#333", titleKey: "communityTopic4Title", author: "Mark Landeo", timeKey: "communityTime4", replies: 30, link: "#" }
    ];

    async function loadComponent(url, placeholderId) {
        // Asegúrate que la URL sea correcta relativa a la página HTML que llama a este script
        // Si la página HTML está en una subcarpeta (ej: /login/login.html) y 'includes' está en la raíz,
        // la URL debería ser '../includes/navbar.html'
        // Si la página HTML está en la raíz y 'includes' está en la raíz, la URL sería 'includes/navbar.html'
        // La ruta que pasaste ('/includes/navbar.html') es absoluta desde la raíz del servidor.
        // Si estás sirviendo desde una subcarpeta del servidor, esto podría fallar.
        // Es más seguro usar rutas relativas o asegurar que el servidor maneje bien las absolutas.

        // Para simplificar, asumiremos que las páginas HTML están en la raíz o que
        // el servidor maneja bien las rutas absolutas desde la raíz del sitio.
        // Si no, necesitarás ajustar la URL en la llamada a loadComponent.
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Error cargando ${url}: ${response.status} ${response.statusText}. Verifica que el archivo exista en la ruta correcta ('${url}') relativa al HTML que lo llama, o que la ruta absoluta sea correcta desde la raíz del servidor.`);
                const placeholder = document.getElementById(placeholderId);
                if(placeholder) placeholder.innerHTML = `<p style="color:red; text-align:center;">Error al cargar componente: ${placeholderId.replace('-placeholder','')}. Revisa la consola.</p>`;
                return false;
            }
            const text = await response.text();
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.innerHTML = text;
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(`Excepción al cargar componente desde ${url}:`, error);
            const placeholder = document.getElementById(placeholderId);
            if(placeholder) placeholder.innerHTML = `<p style="color:red; text-align:center;">Excepción al cargar ${placeholderId.replace('-placeholder','')}. Revisa la consola.</p>`;
            return false;
        }
    }


    async function loadAllSharedComponents() {
        // Determinar la ruta base para los componentes 'includes'
        // Esto es un poco más robusto si tienes páginas en diferentes niveles de profundidad.
        let basePath = '';
        const pathSegments = window.location.pathname.split('/').filter(segment => segment !== '');
        // Si estamos en una subcarpeta (ej: /login/login.html o /register/register.html), pathSegments.length será 2 o más.
        // Si estamos en la raíz (ej: /index.html), pathSegments.length será 1.
        // Si estamos en la raíz y es solo "/", pathSegments.length será 0.
        if (pathSegments.length > 1) { // Si estamos en una subcarpeta
            basePath = '../'; // Necesitamos subir un nivel para llegar a 'includes'
        }
        // Si las páginas HTML están en la raíz, basePath permanecerá '' y 'includes/navbar.html' funcionará.

        const results = await Promise.all([
            loadComponent(`${basePath}includes/navbar.html`, 'navbar-placeholder'),
        ]);

        if (results.every(result => result === true)) {
            initializeNavbarScripts();
            applyInitialLanguage();
            setActiveNavLink();
        } else {
            console.error("No se pudieron cargar todos los componentes compartidos. Algunas funcionalidades podrían no estar disponibles.");
        }

        initializeAOS();

        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1) || "index.html";


        if (filename === "index.html") {
             if (document.querySelector('.search-box .search-tabs')) {
                initializeHeroSearchTabs();
            }
        }
        if (filename === "comunidad.html") {
            initializeCommunityPageScripts();
        }
    }

    const translations = {
        pageTitle: { es: "Cisco-web-upeu", en: "Cisco-web-upeu", pt: "Cisco-web-upeu" },
        pageTitleSoluciones: { es: "Cisco - Soluciones", en: "Cisco - Solutions", pt: "Cisco - Soluções" },
        pageTitlePartners: { es: "Cisco - Partners", en: "Cisco - Partners", pt: "Cisco - Parceiros" },
        pageTitleSoporte: { es: "Cisco - Soporte", en: "Cisco - Support", pt: "Cisco - Suporte" },
        pageTitleComunidad: { es: "Cisco - Comunidad", en: "Cisco - Community", pt: "Cisco - Comunidade" },
        pageTitleLogin: { es: "Cisco - Iniciar Sesión", en: "Cisco - Log In", pt: "Cisco - Entrar" },
        pageTitleRegister: { es: "Cisco - Registrarse", en: "Cisco - Sign Up", pt: "Cisco - Registrar-se" },

        navProducts: { es: "Productos", en: "Products", pt: "Produtos" },
        navSolutions: { es: "Soluciones", en: "Solutions", pt: "Soluções" },
        navSupport: { es: "Soporte", en: "Support", pt: "Suporte" },
        navPartners: { es: "Partners", en: "Partners", pt: "Parceiros" },
        navCommunity: { es: "Comunidad", en: "Community", pt: "Comunidade" },
        loginButton: { es: "Iniciar Sesión", en: "Log In", pt: "Entrar" },

        footerAbout: { es: "Acerca de Cisco", en: "About Cisco", pt: "Sobre a Cisco" },
        footerWhoWeAre: { es: "Quiénes Somos", en: "Who We Are", pt: "Quem Somos" },
        footerNews: { es: "Noticias", en: "News", pt: "Notícias" },
        footerCareers: { es: "Carreras", en: "Careers", pt: "Carreiras" },
        footerInvestors: { es: "Inversores", en: "Investors", pt: "Investidores" },
        footerSupport: { es: "Soporte", en: "Support", pt: "Suporte" },
        footerContactSupport: { es: "Contactar Soporte", en: "Contact Support", pt: "Contatar Suporte" },
        footerDownloads: { es: "Descargas", en: "Downloads", pt: "Downloads" },
        footerCommunityLink: { es: "Comunidad", en: "Community", pt: "Comunidade" },
        footerDocumentation: { es: "Documentación", en: "Documentation", pt: "Documentação" },
        footerResources: { es: "Recursos", en: "Resources", pt: "Recursos" },
        footerBlogs: { es: "Blogs", en: "Blogs", pt: "Blogs" },
        footerEvents: { es: "Eventos", en: "Events", pt: "Eventos" },
        footerPartnersLink: { es: "Partners", en: "Partners", pt: "Parceiros" },
        footerDevelopers: { es: "Desarrolladores", en: "Developers", pt: "Desenvolvedores" },
        footerFollowUs: { es: "Síguenos", en: "Follow Us", pt: "Siga-nos" },
        copyrightText: { es: "© 2024 Cisco Systems, Inc. y/o sus filiales. Todos los derechos reservados. | ", en: "© 2024 Cisco Systems, Inc. and/or its affiliates. All rights reserved. | ", pt: "© 2024 Cisco Systems, Inc. e/ou suas afiliadas. Todos os direitos reservados. | " },
        privacyLink: { es: "Privacidad", en: "Privacy", pt: "Privacidade" },
        termsLink: { es: "Términos", en: "Terms", pt: "Termos" },
        cookiesLink: { es: "Cookies", en: "Cookies", pt: "Cookies" },

        loginEmailLabel: { es: "Correo Electrónico", en: "Email Address", pt: "Endereço de Email" },
        loginPasswordLabel: { es: "Contraseña", en: "Password", pt: "Senha" },
        loginModalButton: { es: "Ingresar", en: "Log In", pt: "Entrar" }, // Reutilizada para login.html
        loginNoAccount: { es: "¿No tienes cuenta?", en: "Don't have an account?", pt: "Não tem uma conta?" },
        loginRegisterLink: { es: "Regístrate aquí", en: "Sign up here", pt: "Cadastre-se aqui" },
        loginForgotPasswordLink: { es: "¿Olvidaste tu contraseña?", en: "Forgot your password?", pt: "Esqueceu sua senha?" },
        loginPageTitle: { es: "Bienvenido de Nuevo", en: "Welcome Back", pt: "Bem-vindo de Volta" }, // Para el H1 en login.html

        // Traducciones para register.html
        registerPageTitle: { es: "Crear Cuenta", en: "Create Account", pt: "Criar Conta" },
        registerFullNameLabel: { es: "Nombre Completo", en: "Full Name", pt: "Nome Completo" },
        registerConfirmPasswordLabel: { es: "Confirmar Contraseña", en: "Confirm Password", pt: "Confirmar Senha" },
        registerButton: { es: "Registrarse", en: "Sign Up", pt: "Registrar-se" },
        registerAlreadyAccount: { es: "¿Ya tienes una cuenta?", en: "Already have an account?", pt: "Já tem uma conta?" },
        registerLoginLink: { es: "Inicia sesión aquí", en: "Log in here", pt: "Faça login aqui" },

        learnMoreLink: { es: "Descubre Más →", en: "Learn More →", pt: "Saiba Mais →" },
        readMoreLink: { es: "Leer Más →", en: "Read More →", pt: "Leia Mais →" },
        readFullCaseLink: { es: "Leer Caso Completo →", en: "Read Full Case →", pt: "Ler Caso Completo →" },
        searchButton: { es: "Buscar Ahora", en: "Search Now", pt: "Buscar Agora" },
        heroTitle: { es: "Descubre el Futuro de la Red con Cisco", en: "Discover the Future of Networking with Cisco", pt: "Descubra o Futuro das Redes com a Cisco" },
        heroSubtitle: { es: "Soluciones innovadoras para un mundo conectado y seguro.", en: "Innovative solutions for a connected and secure world.", pt: "Soluções inovadoras para um mundo conectado e seguro." },
        searchTabSolutions: { es: "Buscar Soluciones", en: "Search Solutions", pt: "Buscar Soluções" },
        searchTabProducts: { es: "Consultar Productos", en: "Browse Products", pt: "Consultar Produtos" },
        searchTabResources: { es: "Recursos Técnicos", en: "Technical Resources", pt: "Recursos Técnicos" },
        quickLinkNetworking: { es: "Networking", en: "Networking", pt: "Redes" },
        quickLinkSecurity: { es: "Seguridad", en: "Security", pt: "Segurança" },
        quickLinkCollaboration: { es: "Colaboración", en: "Collaboration", pt: "Colaboração" },
        quickLinkDataCenter: { es: "Data Center", en: "Data Center", pt: "Data Center" },
        promoTitle: { es: "Innovaciones Destacadas de Cisco", en: "Cisco's Featured Innovations", pt: "Inovações em Destaque da Cisco" },
        promoCard1Title: { es: "Soluciones Cloud Híbridas", en: "Hybrid Cloud Solutions", pt: "Soluções de Nuvem Híbrida" },
        promoCard1Desc: { es: "Integra y gestiona tus entornos cloud con la flexibilidad y seguridad que necesitas.", en: "Integrate and manage your cloud environments with the flexibility and security you need.", pt: "Integre e gerencie seus ambientes de nuvem com a flexibilidade e segurança que você precisa." },
        promoCard2Title: { es: "Seguridad de Red Avanzada", en: "Advanced Network Security", pt: "Segurança de Rede Avançada" },
        promoCard2Desc: { es: "Protege tu infraestructura crítica con nuestras soluciones de ciberseguridad de última generación.", en: "Protect your critical infrastructure with our next-generation cybersecurity solutions.", pt: "Proteja sua infraestrutura crítica com nossas soluções de cibersegurança de última geração." },
        viewSolutionsLink: { es: "Ver Soluciones →", en: "View Solutions →", pt: "Ver Soluções →" },
        promoCard3Title: { es: "Colaboración Inteligente", en: "Intelligent Collaboration", pt: "Colaboração Inteligente" },
        promoCard3Desc: { es: "Transforma la forma en que tus equipos trabajan juntos con Webex y nuestras herramientas.", en: "Transform how your teams work together with Webex and our tools.", pt: "Transforme a maneira como suas equipes trabalham juntas com o Webex e nossas ferramentas." },
        exploreWebexLink: { es: "Explorar Webex →", en: "Explore Webex →", pt: "Explorar Webex →" },
        successTitle: { es: "Casos de Éxito de Nuestros Clientes", en: "Customer Success Stories", pt: "Casos de Sucesso de Nossos Clientes" },
        successSubtitle: { es: "Vea cómo hemos ayudado a empresas como la suya a alcanzar sus objetivos.", en: "See how we've helped companies like yours achieve their goals.", pt: "Veja como ajudamos empresas como a sua a alcançar seus objetivos." },
        successStory1Title: { es: "Transformación Digital en Retail", en: "Digital Transformation in Retail", pt: "Transformação Digital no Varejo" },
        successStory1Desc: { es: "\"Las soluciones de Cisco nos permitieron optimizar nuestra red y mejorar la experiencia del cliente en un 30%.\"", en: "\"Cisco solutions allowed us to optimize our network and improve customer experience by 30%.\"", pt: "\"As soluções da Cisco nos permitiram otimizar nossa rede e melhorar a experiência do cliente em 30%.\"" },
        successStory2Title: { es: "Seguridad Reforzada en Sector Financiero", en: "Enhanced Security in Financial Sector", pt: "Segurança Reforçada no Setor Financeiro" },
        successStory2Desc: { es: "\"Con Cisco Secure, hemos fortalecido nuestras defensas contra ciberamenazas y cumplimos con las regulaciones más exigentes.\"", en: "\"With Cisco Secure, we have strengthened our defenses against cyber threats and comply with the most demanding regulations.\"", pt: "\"Com o Cisco Secure, fortalecemos nossas defesas contra ameaças cibernéticas e cumprimos as regulamentações mais exigentes.\"" },
        successStory3Title: { es: "Mejora de la Colaboración en Salud", en: "Improved Collaboration in Healthcare", pt: "Melhoria da Colaboração na Saúde" },
        successStory3Desc: { es: "\"Webex ha revolucionado la comunicación entre nuestro personal médico, mejorando la atención al paciente.\"", en: "\"Webex has revolutionized communication among our medical staff, improving patient care.\"", pt: "\"O Webex revolucionou a comunicação entre nossa equipe médica, melhorando o atendimento ao paciente.\"" },
        newsTitle: { es: "Últimas Noticias y Tendencias", en: "Latest News and Trends", pt: "Últimas Notícias e Tendências" },
        newsCard1Title: { es: "El Futuro de la IA en Networking", en: "The Future of AI in Networking", pt: "O Futuro da IA em Redes" },
        newsCard1Date: { es: "20 de Octubre, 2023", en: "October 20, 2023", pt: "20 de Outubro, 2023" },
        newsCard1Desc: { es: "Descubre cómo la inteligencia artificial está revolucionando la gestión y seguridad de las redes empresariales.", en: "Discover how artificial intelligence is revolutionizing the management and security of enterprise networks.", pt: "Descubra como a inteligência artificial está revolucionando o gerenciamento e a segurança das redes empresariais." },
        newsCard2Title: { es: "Webinar: Maximizando la Seguridad en la Nube", en: "Webinar: Maximizing Cloud Security", pt: "Webinar: Maximizando a Segurança na Nuvem" },
        newsCard2Date: { es: "Próximo: 5 de Noviembre, 2023", en: "Upcoming: November 5, 2023", pt: "Próximo: 5 de Novembro, 2023" },
        newsCard2Desc: { es: "Únete a nuestros expertos para aprender estrategias clave para proteger tus activos en entornos multi-cloud.", en: "Join our experts to learn key strategies for protecting your assets in multi-cloud environments.", pt: "Junte-se aos nossos especialistas para aprender estratégias importantes para proteger seus ativos em ambientes multinuvem." },
        registerLink: { es: "Registrarse →", en: "Register →", pt: "Inscreva-se →" },
        newsCard3Title: { es: "Nuevo Cisco Catalyst Serie X: Potencia y Eficiencia", en: "New Cisco Catalyst X Series: Power and Efficiency", pt: "Nova Série Cisco Catalyst X: Potência e Eficiência" },
        newsCard3Date: { es: "10 de Octubre, 2023", en: "October 10, 2023", pt: "10 de Outubro, 2023" },
        newsCard3Desc: { es: "Presentamos la nueva generación de switches diseñados para las demandas de la red moderna.", en: "Introducing the new generation of switches designed for the demands of the modern network.", pt: "Apresentamos a nova geração de switches projetados para as demandas da rede moderna." },
        partnersSectionTitle: { es: "Conviértete en Partner de Cisco", en: "Become a Cisco Partner", pt: "Torne-se um Parceiro Cisco" },
        partnersSectionSubtitle: { es: "Únete a nuestro ecosistema de partners y accede a beneficios exclusivos, recursos y oportunidades para crecer tu negocio con las soluciones líderes de la industria.", en: "Join our partner ecosystem and access exclusive benefits, resources, and opportunities to grow your business with industry-leading solutions.", pt: "Junte-se ao nosso ecossistema de parceiros e acesse benefícios exclusivos, recursos e oportunidades para expandir seus negócios com as soluções líderes do setor." },
        partnerBenefit1Title: { es: "Nuevas Oportunidades", en: "New Opportunities", pt: "Novas Oportunidades" },
        partnerBenefit1Desc: { es: "Expande tu alcance y accede a nuevos mercados con el respaldo de Cisco.", en: "Expand your reach and access new markets with Cisco's support.", pt: "Expanda seu alcance e acesse novos mercados com o apoio da Cisco." },
        partnerBenefit2Title: { es: "Recursos y Formación", en: "Resources and Training", pt: "Recursos e Treinamento" },
        partnerBenefit2Desc: { es: "Capacitación de clase mundial, herramientas de marketing y soporte técnico especializado.", en: "World-class training, marketing tools, and specialized technical support.", pt: "Treinamento de classe mundial, ferramentas de marketing e suporte técnico especializado." },
        partnerBenefit3Title: { es: "Innovación Constante", en: "Constant Innovation", pt: "Inovação Constante" },
        partnerBenefit3Desc: { es: "Sé parte de la vanguardia tecnológica y ofrece soluciones de futuro a tus clientes.", en: "Be part of the technological forefront and offer future-proof solutions to your customers.", pt: "Faça parte da vanguarda tecnológica e ofereça soluções futuras aos seus clientes." },
        partnerBenefit4Title: { es: "Comunidad Global", en: "Global Community", pt: "Comunidade Global" },
        partnerBenefit4Desc: { es: "Conecta con otros partners, comparte experiencias y colabora en proyectos.", en: "Connect with other partners, share experiences, and collaborate on projects.", pt: "Conecte-se com outros parceiros, compartilhe experiências e colabore em projetos." },
        joinPartnersButton: { es: "Únete al Programa de Partners", en: "Join the Partner Program", pt: "Junte-se ao Programa de Parceiros" },
        moreInfoButton: { es: "Más Información", en: "More Information", pt: "Mais Informações" },
        solutionsHeroTitle: { es: "Soluciones Integrales para Tu Negocio", en: "Comprehensive Solutions for Your Business", pt: "Soluções Abrangentes para o Seu Negócio" },
        solutionsHeroSubtitle: { es: "Descubre cómo nuestras tecnologías innovadoras pueden ayudarte a superar tus desafíos y alcanzar tus objetivos estratégicos.", en: "Discover how our innovative technologies can help you overcome your challenges and achieve your strategic goals.", pt: "Descubra como nossas tecnologias inovadoras podem ajudá-lo a superar seus desafios e alcançar seus objetivos estratégicos." },
        solutionAreasTitle: { es: "Nuestras Áreas de Solución", en: "Our Solution Areas", pt: "Nossas Áreas de Solução" },
        intelligentNetworksTitle: { es: "Redes Inteligentes", en: "Intelligent Networks", pt: "Redes Inteligentes" },
        intelligentNetworksDesc: { es: "Construye redes seguras, ágiles y automatizadas que impulsen la innovación y la eficiencia operativa.", en: "Build secure, agile, and automated networks that drive innovation and operational efficiency.", pt: "Construa redes seguras, ágeis e automatizadas que impulsionem a inovação e a eficiência operacional." },
        comprehensiveSecurityTitle: { es: "Seguridad Integral", en: "Comprehensive Security", pt: "Segurança Integral" },
        comprehensiveSecurityDesc: { es: "Protege tu organización contra amenazas avanzadas con una arquitectura de seguridad integrada y proactiva.", en: "Protect your organization against advanced threats with an integrated and proactive security architecture.", pt: "Proteja sua organização contra ameaças avançadas com uma arquitetura de segurança integrada e proativa." },
        smartCollaborationTitle: { es: "Colaboración Inteligente", en: "Smart Collaboration", pt: "Colaboração Inteligente" },
        smartCollaborationDesc: { es: "Fomenta la productividad y la conexión entre equipos con herramientas de colaboración seguras y flexibles.", en: "Foster productivity and team connection with secure and flexible collaboration tools.", pt: "Promova a produtividade e a conexão entre equipes com ferramentas de colaboração seguras e flexíveis." },
        dataCenterCloudTitle: { es: "Data Center y Cloud", en: "Data Center and Cloud", pt: "Data Center e Nuvem" },
        dataCenterCloudDesc: { es: "Moderniza tu centro de datos y adopta estrategias de nube híbrida para mayor agilidad y escalabilidad.", en: "Modernize your data center and adopt hybrid cloud strategies for greater agility and scalability.", pt: "Modernize seu data center e adote estratégias de nuvem híbrida para maior agilidade e escalabilidade." },
        cloudSolutionsTitle: { es: "Soluciones Cloud", en: "Cloud Solutions", pt: "Soluções em Nuvem" },
        cloudSolutionsDesc: { es: "Acelera tu transformación digital con nuestras soluciones cloud nativas y servicios gestionados.", en: "Accelerate your digital transformation with our native cloud solutions and managed services.", pt: "Acelere sua transformação digital com nossas soluções nativas em nuvem e serviços gerenciados." },
        iotSolutionsTitle: { es: "Internet de las Cosas (IoT)", en: "Internet of Things (IoT)", pt: "Internet das Coisas (IoT)" },
        iotSolutionsDesc: { es: "Conecta, gestiona y asegura tus dispositivos IoT para obtener información valiosa y crear nuevas oportunidades.", en: "Connect, manage, and secure your IoT devices to gain valuable insights and create new opportunities.", pt: "Conecte, gerencie e proteja seus dispositivos IoT para obter informações valiosas e criar novas oportunidades." },
        featuredSolutionsTitle: { es: "Soluciones Destacadas", en: "Featured Solutions", pt: "Soluções em Destaque" },
        sdwanTitle: { es: "Transformación de la WAN con Cisco SD-WAN", en: "WAN Transformation with Cisco SD-WAN", pt: "Transformação da WAN com Cisco SD-WAN" },
        sdwanDesc: { es: "Optimiza el rendimiento de tus aplicaciones, mejora la agilidad de la red y reduce costos con nuestra solución líder en SD-WAN. Conecta de forma segura tus sucursales, usuarios remotos y entornos multi-cloud.", en: "Optimize application performance, improve network agility, and reduce costs with our leading SD-WAN solution. Securely connect your branches, remote users, and multi-cloud environments.", pt: "Otimize o desempenho de seus aplicativos, melhore a agilidade da rede e reduza custos com nossa solução líder em SD-WAN. Conecte com segurança suas filiais, usuários remotos e ambientes multinuvem." },
        learnSdwanButton: { es: "Conocer SD-WAN", en: "Learn about SD-WAN", pt: "Conhecer SD-WAN" },
        zeroTrustTitle: { es: "Adopta un Enfoque Zero Trust con Cisco Secure", en: "Adopt a Zero Trust Approach with Cisco Secure", pt: "Adote uma Abordagem Zero Trust com Cisco Secure" },
        zeroTrustDesc: { es: "Protege tu fuerza laboral, cargas de trabajo y espacios de trabajo con una estrategia de seguridad Zero Trust. Verifica cada acceso, detecta amenazas rápidamente y automatiza la respuesta para minimizar el impacto.", en: "Protect your workforce, workloads, and workspaces with a Zero Trust security strategy. Verify every access, detect threats quickly, and automate response to minimize impact.", pt: "Proteja sua força de trabalho, cargas de trabalho e espaços de trabalho com uma estratégia de segurança Zero Trust. Verifique cada acesso, detecte ameaças rapidamente e automatize a resposta para minimizar o impacto." },
        exploreZeroTrustButton: { es: "Explorar Zero Trust", en: "Explore Zero Trust", pt: "Explorar Zero Trust" },
        transformBusinessTitle: { es: "Transforma tu Negocio Hoy", en: "Transform Your Business Today", pt: "Transforme Seu Negócio Hoje" },
        transformBusinessSubtitle: { es: "Nuestros expertos están listos para ayudarte a diseñar la solución perfecta para tus necesidades. Contáctanos para una consulta personalizada.", en: "Our experts are ready to help you design the perfect solution for your needs. Contact us for a personalized consultation.", pt: "Nossos especialistas estão prontos para ajudá-lo a projetar a solução perfeita para suas necessidades. Contate-nos para uma consulta personalizada." },
        contactSalesButton: { es: "Contactar a Ventas", en: "Contact Sales", pt: "Contatar Vendas" },
        exploreSuccessCasesButton: { es: "Explorar Casos de Éxito", en: "Explore Success Cases", pt: "Explorar Casos de Sucesso" },
        projectLeadersTitle: { es: "LIDERES DEL PROYECTO", en: "PROJECT LEADERS", pt: "LÍDERES DE PROJETO" },
        projectLeadersIntro: { es: "Conoce a los líderes que dirigen la visión y estrategia de nuestro ecosistema de partners, impulsando la innovación y el crecimiento conjunto.", en: "Meet the leaders who drive the vision and strategy of our partner ecosystem, fostering innovation and joint growth.", pt: "Conheça os líderes que conduzem a visão e estratégia do nosso ecossistema de parceiros, impulsionando a inovação e o crescimento conjunto." },
        leaderRole: { es: "LÍDER", en: "LEADER", pt: "LÍDER" },
        luisEduardoDesc: { es: "Encabezando la estrategia y fomentando alianzas clave para el éxito del proyecto.", en: "Spearheading strategy and fostering key alliances for project success.", pt: "Liderando a estratégia e fomentando alianças chave para o sucesso do projeto." },
        lissMozombiteDesc: { es: "Liderando la innovación en soluciones y optimización de procesos para el equipo.", en: "Leading innovation in solutions and process optimization for the team.", pt: "Liderando a inovação em soluções e otimização de processos para a equipe." },
        juanSolanoDesc: { es: "Dirigiendo la implementación de tecnologías avanzadas y la arquitectura de soluciones.", en: "Directing the implementation of advanced technologies and solution architecture.", pt: "Dirigindo a implementação de tecnologias avançadas e a arquitetura de soluções." },
        itTeamTitle: { es: "EQUIPO TI", en: "IT TEAM", pt: "EQUIPE DE TI" },
        itTeamIntro: { es: "Nuestro talentoso equipo de TI está comprometido con el desarrollo, implementación y soporte de soluciones de vanguardia para nuestros clientes y partners.", en: "Our talented IT team is committed to developing, implementing, and supporting cutting-edge solutions for our customers and partners.", pt: "Nossa talentosa equipe de TI está comprometida com o desenvolvimento, implementação e suporte de soluções de ponta para nossos clientes e parceiros." },
        teamRole: { es: "EQUIPO", en: "TEAM", pt: "EQUIPE" },
        markLandeoDesc: { es: "Impulsando la innovación tecnológica y la excelencia operativa dentro del equipo.", en: "Driving technological innovation and operational excellence within the team.", pt: "Impulsionando a inovação tecnológica e a excelência operacional dentro da equipe." },
        aaronLopezDesc: { es: "Gestionando recursos clave y asegurando la calidad en la entrega de soluciones.", en: "Managing key resources and ensuring quality in solution delivery.", pt: "Gerenciando recursos chave e assegurando a qualidade na entrega de soluções." },
        cesiaPintadoDesc: { es: "Especialista en análisis de datos y mejora continua de procesos.", en: "Specialist in data analysis and continuous process improvement.", pt: "Especialista em análise de dados e melhoria contínua de processos." },
        diegoAlonsoDesc: { es: "Desarrollando soluciones robustas y escalables para nuestros partners.", en: "Developing robust and scalable solutions for our partners.", pt: "Desenvolvendo soluções robustas e escaláveis para nossos parceiros." },
        isaitCamizanDesc: { es: "Enfocado en la seguridad informática y la protección de la infraestructura.", en: "Focused on IT security and infrastructure protection.", pt: "Focado em segurança da informação e proteção da infraestrutura." },
        joseFalconDesc: { es: "Brindando soporte técnico especializado y asegurando la satisfacción del cliente.", en: "Providing specialized technical support and ensuring customer satisfaction.", pt: "Fornecendo suporte técnico especializado e garantindo a satisfação do cliente." },
        juanMatallanaDesc: { es: "Contribuyendo con soluciones creativas y eficientes para los desafíos TI.", en: "Contributing with creative and efficient solutions for IT challenges.", pt: "Contribuindo com soluções criativas e eficientes para os desafios de TI." },
        lesterSamuelDesc: { es: "Dedicado a la gestión de proyectos y la coordinación de equipos técnicos.", en: "Dedicated to project management and technical team coordination.", pt: "Dedicado à gestão de projetos e coordenação de equipes técnicas." },
        medalithBecerrilDesc: { es: "Optimizando la infraestructura tecnológica para un rendimiento superior.", en: "Optimizing technological infrastructure for superior performance.", pt: "Otimizando a infraestrutura tecnológica para um desempenho superior." },
        romuloRenatoDesc: { es: "Innovando en el desarrollo de software y aplicaciones personalizadas.", en: "Innovating in software development and custom applications.", pt: "Inovando no desenvolvimento de software e aplicativos personalizados." },
        yomerYsidroDesc: { es: "Asegurando la calidad y fiabilidad de todas nuestras soluciones TI.", en: "Ensuring the quality and reliability of all our IT solutions.", pt: "Assegurando a qualidade e confiabilidade de todas as nossas soluções de TI." },
        calebIzquierdoDesc: { es: "Apoyando en la investigación y adopción de tecnologías emergentes.", en: "Supporting research and adoption of emerging technologies.", pt: "Apoiando na pesquisa e adoção de tecnologias emergentes." },
        supportHeroTitle: { es: "Estamos Aquí para Ayudarte", en: "We're Here to Help", pt: "Estamos Aqui para Ajudar" },
        supportHeroSubtitle: { es: "Encuentra la información, los recursos y el soporte que necesitas para aprovechar al máximo tus soluciones Cisco.", en: "Find the information, resources, and support you need to make the most of your Cisco solutions.", pt: "Encontre as informações, os recursos e o suporte que você precisa para aproveitar ao máximo suas soluções Cisco." },
        supportSearchPlaceholder: { es: "Buscar en Soporte (ej: configurar VPN, error 503...)", en: "Search Support (e.g., configure VPN, error 503...)", pt: "Buscar no Suporte (ex: configurar VPN, erro 503...)" },
        quickHelpTitle: { es: "Encuentra Ayuda Rápidamente", en: "Find Help Quickly", pt: "Encontre Ajuda Rapidamente" },
        techDocsTitle: { es: "Documentación Técnica", en: "Technical Documentation", pt: "Documentação Técnica" },
        techDocsDesc: { es: "Accede a guías de instalación, configuración, hojas de datos y manuales de usuario detallados.", en: "Access detailed installation, configuration, datasheets, and user manuals.", pt: "Acesse guias detalhados de instalação, configuração, folhas de dados e manuais do usuário." },
        exploreDocsLink: { es: "Explorar Documentación →", en: "Explore Documentation →", pt: "Explorar Documentação →" },
        softwareDownloadsTitle: { es: "Descargas de Software", en: "Software Downloads", pt: "Downloads de Software" },
        softwareDownloadsDesc: { es: "Obtén las últimas versiones de firmware, software, parches y herramientas para tus productos.", en: "Get the latest firmware, software, patches, and tools for your products.", pt: "Obtenha as versões mais recentes de firmware, software, patches e ferramentas para seus produtos." },
        goToDownloadsLink: { es: "Ir a Descargas →", en: "Go to Downloads →", pt: "Ir para Downloads →" },
        supportCommunityTitle: { es: "Comunidad de Soporte", en: "Support Community", pt: "Comunidade de Suporte" },
        supportCommunityDesc: { es: "Conéctate con otros usuarios, haz preguntas y comparte conocimientos en nuestros foros.", en: "Connect with other users, ask questions, and share knowledge in our forums.", pt: "Conecte-se com outros usuários, faça perguntas e compartilhe conhecimento em nossos fóruns." },
        visitCommunityLink: { es: "Visitar Comunidad →", en: "Visit Community →", pt: "Visitar Comunidade →" },
        contactSupportTitle: { es: "Contactar Soporte", en: "Contact Support", pt: "Contatar Suporte" },
        contactSupportDesc: { es: "Si no encuentras lo que buscas, nuestro equipo de expertos está listo para ayudarte directamente.", en: "If you can't find what you're looking for, our team of experts is ready to assist you directly.", pt: "Se você não encontrar o que procura, nossa equipe de especialistas está pronta para ajudá-lo diretamente." },
        viewContactOptionsLink: { es: "Ver Opciones de Contacto →", en: "View Contact Options →", pt: "Ver Opções de Contato →" },
        popularResourcesTitle: { es: "Recursos Populares de Soporte", en: "Popular Support Resources", pt: "Recursos Populares de Suporte" },
        resourceLink1: { es: "Guía de Configuración Inicial para Routers ISR 4000", en: "Initial Setup Guide for ISR 4000 Routers", pt: "Guia de Configuração Inicial para Roteadores ISR 4000" },
        resourceDesc1: { es: "Guía paso a paso para la puesta en marcha.", en: "Step-by-step guide for getting started.", pt: "Guia passo a passo para começar." },
        resourceLink2: { es: "Solución de Problemas Comunes en Conexiones VPN AnyConnect", en: "Troubleshooting Common Issues in AnyConnect VPN Connections", pt: "Solução de Problemas Comuns em Conexões VPN AnyConnect" },
        resourceDesc2: { es: "Diagnostica y resuelve los problemas más frecuentes.", en: "Diagnose and resolve the most frequent problems.", pt: "Diagnostique e resolva os problemas mais frequentes." },
        resourceLink3: { es: "Actualización de Firmware para Switches Catalyst 9200", en: "Firmware Update for Catalyst 9200 Switches", pt: "Atualização de Firmware para Switches Catalyst 9200" },
        resourceDesc3: { es: "Instrucciones y mejores prácticas para actualizar.", en: "Instructions and best practices for updating.", pt: "Instruções e melhores práticas para atualizar." },
        resourceLink4: { es: "Entendiendo las Licencias Smart de Cisco", en: "Understanding Cisco Smart Licensing", pt: "Entendendo as Licenças Smart da Cisco" },
        resourceDesc4: { es: "Todo lo que necesitas saber sobre la gestión de licencias.", en: "Everything you need to know about license management.", pt: "Tudo o que você precisa saber sobre gerenciamento de licenças." },
        resourceLink5: { es: "Cómo Abrir un Caso de Soporte (TAC)", en: "How to Open a Support Case (TAC)", pt: "Como Abrir um Caso de Suporte (TAC)" },
        resourceDesc5: { es: "Proceso para solicitar asistencia técnica especializada.", en: "Process for requesting specialized technical assistance.", pt: "Processo para solicitar assistência técnica especializada." },
        personalizedHelpTitle: { es: "¿Necesitas Ayuda Personalizada?", en: "Need Personalized Help?", pt: "Precisa de Ajuda Personalizada?" },
        personalizedHelpDesc: { es: "Nuestro equipo de soporte técnico está disponible para asistirte con cualquier consulta o problema que puedas tener. Elige la opción que mejor se adapte a tus necesidades.", en: "Our technical support team is available to assist you with any questions or issues you may have. Choose the option that best suits your needs.", pt: "Nossa equipe de suporte técnico está disponível para ajudá-lo com quaisquer dúvidas ou problemas que você possa ter. Escolha a opção que melhor se adapta às suas necessidades." },
        openCaseButton: { es: "Abrir un Caso Online", en: "Open a Case Online", pt: "Abrir um Caso Online" },
        findSupportPartnerButton: { es: "Encontrar un Partner de Soporte", en: "Find a Support Partner", pt: "Encontrar um Parceiro de Suporte" },
        communityHeroTitle: { es: "Bienvenido a la Comunidad Cisco", en: "Welcome to the Cisco Community", pt: "Bem-vindo à Comunidade Cisco" },
        communityHeroSubtitle: { es: "Conecta, colabora y comparte conocimientos con miles de profesionales y expertos de Cisco de todo el mundo.", en: "Connect, collaborate, and share knowledge with thousands of Cisco professionals and experts worldwide.", pt: "Conecte, colabore e compartilhe conhecimento com milhares de profissionais e especialistas da Cisco em todo o mundo." },
        joinNowButton: { es: "¡Únete Ahora!", en: "Join Now!", pt: "Junte-se Agora!" },
        joinConversationTitle: { es: "Únete a la Conversación", en: "Join the Conversation", pt: "Junte-se à Conversa" },
        forumsTitle: { es: "Foros de Discusión", en: "Discussion Forums", pt: "Fóruns de Discussão" },
        forumsDesc: { es: "Participa en debates técnicos, resuelve dudas y comparte tus experiencias sobre productos y soluciones Cisco.", en: "Participate in technical discussions, resolve doubts, and share your experiences on Cisco products and solutions.", pt: "Participe de discussões técnicas, tire dúvidas e compartilhe suas experiências sobre produtos e soluções Cisco." },
        exploreForumsLink: { es: "Explorar Foros →", en: "Explore Forums →", pt: "Explorar Fóruns →" },
        userGroupsTitle: { es: "Grupos de Usuarios", en: "User Groups", pt: "Grupos de Usuários" },
        userGroupsDesc: { es: "Encuentra o crea grupos basados en intereses específicos, ubicación geográfica o tecnologías particulares.", en: "Find or create groups based on specific interests, geographic location, or particular technologies.", pt: "Encontre ou crie grupos baseados em interesses específicos, localização geográfica ou tecnologias particulares." },
        viewGroupsLink: { es: "Ver Grupos →", en: "View Groups →", pt: "Ver Grupos →" },
        communityBlogsTitle: { es: "Blogs de la Comunidad", en: "Community Blogs", pt: "Blogs da Comunidade" },
        communityBlogsDesc: { es: "Lee artículos de expertos de Cisco y miembros destacados sobre las últimas tendencias y mejores prácticas.", en: "Read articles from Cisco experts and featured members on the latest trends and best practices.", pt: "Leia artigos de especialistas da Cisco e membros destacados sobre as últimas tendências e melhores práticas." },
        readBlogsLink: { es: "Leer Blogs →", en: "Read Blogs →", pt: "Ler Blogs →" },
        eventsWebinarsTitle: { es: "Eventos y Webinars", en: "Events and Webinars", pt: "Eventos e Webinars" },
        eventsWebinarsDesc: { es: "Participa en eventos en línea y presenciales organizados por y para la comunidad Cisco.", en: "Participate in online and in-person events organized by and for the Cisco community.", pt: "Participe de eventos online e presenciais organizados pela e para a comunidade Cisco." },
        viewEventsLink: { es: "Ver Eventos →", en: "View Events →", pt: "Ver Eventos →" },
        activeDiscussionsTitle: { es: "Discusiones Activas", en: "Active Discussions", pt: "Discussões Ativas" },
        viewAllDiscussionsButton: { es: "Ver Todas las Discusiones", en: "View All Discussions", pt: "Ver Todas as Discussões" },
        featuredMembersTitle: { es: "Conoce a Nuestros Miembros Destacados", en: "Meet Our Featured Members", pt: "Conheça Nossos Membros em Destaque" },
        readyToContributeTitle: { es: "¿Listo para Contribuir?", en: "Ready to Contribute?", pt: "Pronto para Contribuir?" },
        readyToContributeSubtitle: { es: "Tu conocimiento y experiencia son valiosos. Aprende cómo puedes participar, ayudar a otros y convertirte en un líder dentro de la Comunidad Cisco.", en: "Your knowledge and experience are valuable. Learn how you can participate, help others, and become a leader within the Cisco Community.", pt: "Seu conhecimento e experiência são valiosos. Aprenda como você pode participar, ajudar outros e se tornar um líder na Comunidade Cisco." },
        learnToContributeButton: { es: "Aprende Cómo Contribuir", en: "Learn How to Contribute", pt: "Aprenda Como Contribuir" },

        // --- NUEVAS TRADUCCIONES PARA DISCUSIONES ACTIVAS ---
        postedByKey: { es: "Por", en: "By", pt: "Por" },
        repliesSuffixKey: { es: "Respuestas", en: "Replies", pt: "Respostas" },

        communityTopic1Title: { es: "Mejores prácticas para configurar SD-WAN en sucursales remotas", en: "Best practices for configuring SD-WAN in remote branches", pt: "Melhores práticas para configurar SD-WAN em filiais remotas" },
        communityTime1: { es: "Hace 2 horas", en: "2 hours ago", pt: "Há 2 horas" },

        communityTopic2Title: { es: "Duda sobre licenciamiento de Cisco DNA Center", en: "Doubt about Cisco DNA Center licensing", pt: "Dúvida sobre licenciamento do Cisco DNA Center" },
        communityTime2: { es: "Hace 5 horas", en: "5 hours ago", pt: "Há 5 horas" },

        communityTopic3Title: { es: "Experiencias con la migración a Wi-Fi 6E", en: "Experiences with migrating to Wi-Fi 6E", pt: "Experiências com a migração para Wi-Fi 6E" },
        communityTime3: { es: "Hace 1 día", en: "1 day ago", pt: "Há 1 dia" },

        communityTopic4Title: { es: "Tutorial: Automatización de red con Python y APIs de Meraki", en: "Tutorial: Network automation with Python and Meraki APIs", pt: "Tutorial: Automação de rede com Python e APIs Meraki" },
        communityTime4: { es: "Hace 2 días", en: "2 days ago", pt: "Há 2 dias" },
    };

    // --- FUNCIONES DE RENDERIZADO DE TEMAS DE COMUNIDAD ---
    function createTopicElement(topic, lang) {
        const li = document.createElement('li');
        li.classList.add('topic-item');

        let avatarStyle = `background-color: ${topic.bgColor || '#0073b1'};`;
        if (topic.textColor) {
            avatarStyle += ` color: ${topic.textColor};`;
        }

        // Obtener traducciones, con fallback a español si no existe la traducción para el idioma actual
        const title = (translations[topic.titleKey] && translations[topic.titleKey][lang]) || (translations[topic.titleKey] && translations[topic.titleKey]['es']) || topic.titleKey;
        const time = (translations[topic.timeKey] && translations[topic.timeKey][lang]) || (translations[topic.timeKey] && translations[topic.timeKey]['es']) || topic.timeKey;
        const postedByText = (translations.postedByKey && translations.postedByKey[lang]) || (translations.postedByKey && translations.postedByKey['es']) || "Por";
        const repliesSuffixText = (translations.repliesSuffixKey && translations.repliesSuffixKey[lang]) || (translations.repliesSuffixKey && translations.repliesSuffixKey['es']) || "Respuestas";

        li.innerHTML = `
            <div class="topic-avatar" style="${avatarStyle}">${topic.avatar}</div>
            <div class="topic-content">
                <h4><a href="${topic.link}">${title}</a></h4>
                <div class="topic-meta">
                    <span>${postedByText} <a href="#">${topic.author}</a></span> •
                    <span>${time}</span> •
                    <span class="replies-count">${topic.replies} ${repliesSuffixText}</span>
                </div>
            </div>
        `;
        return li;
    }

    function renderAllTopics(topicsListElement, lang) {
        if (!topicsListElement) return;
        topicsListElement.innerHTML = ''; // Limpiar temas existentes
        COMMUNITY_TOPICS_DATA.forEach(topic => {
            const topicElement = createTopicElement(topic, lang);
            topicsListElement.appendChild(topicElement);
        });
    }


    function applyTranslations(lang) {
        document.documentElement.lang = lang;

        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1) || "index.html";
        let pageTitleKey = 'pageTitle';

        if (filename === "soluciones.html") pageTitleKey = 'pageTitleSoluciones';
        else if (filename === "partners.html") pageTitleKey = 'pageTitlePartners';
        else if (filename === "soporte.html") pageTitleKey = 'pageTitleSoporte';
        else if (filename === "comunidad.html") pageTitleKey = 'pageTitleComunidad';

        const pageTitleElement = document.querySelector('title');
        if (pageTitleElement && translations[pageTitleKey] && translations[pageTitleKey][lang]) {
            pageTitleElement.textContent = translations[pageTitleKey][lang];
        } else if (pageTitleElement && translations['pageTitle'] && translations['pageTitle'][lang]) {
             pageTitleElement.textContent = translations['pageTitle'][lang];
        }

        document.querySelectorAll('[data-translate-key]').forEach(element => {
            const key = element.getAttribute('data-translate-key');
            const translationSet = translations[key];
            if (translationSet) {
                if (key === 'copyrightText') {
                    let baseText = translationSet[lang] || translationSet['es'];
                    const privacyText = (translations.privacyLink && (translations.privacyLink[lang] || translations.privacyLink['es']));
                    const termsText = (translations.termsLink && (translations.termsLink[lang] || translations.termsLink['es']));
                    const cookiesText = (translations.cookiesLink && (translations.cookiesLink[lang] || translations.cookiesLink['es']));
                    element.innerHTML = `${baseText}<a href="#" data-translate-key="privacyLink">${privacyText}</a> | <a href="#" data-translate-key="termsLink">${termsText}</a> | <a href="#" data-translate-key="cookiesLink">${cookiesText}</a>`;
                } else {
                    element.textContent = translationSet[lang] || translationSet['es'];
                }
            }
        });

        const searchTabsButtons = document.querySelectorAll('#navbar-placeholder .search-tabs .tab-btn, main .search-tabs .tab-btn');
        const searchMainInput = document.getElementById('search-main');
        if (searchTabsButtons.length > 0 && searchMainInput) {
            searchTabsButtons.forEach(tab => {
                const placeholderKey = `data-placeholder-${lang}`;
                if (tab.hasAttribute(placeholderKey)) {
                    if (tab.classList.contains('active')) {
                        searchMainInput.placeholder = tab.getAttribute(placeholderKey);
                    }
                }
            });
        }

        const currentLangBtnText = document.getElementById('selectedLangTextHeader');
        if (currentLangBtnText) {
            if (lang === 'es') currentLangBtnText.textContent = 'ES';
            if (lang === 'en') currentLangBtnText.textContent = 'EN';
            if (lang === 'pt') currentLangBtnText.textContent = 'PT';
        }

        const langDropdownLinks = document.querySelectorAll('#languageDropdownHeader a');
        if(langDropdownLinks.length > 0) {
            langDropdownLinks.forEach(a => {
                a.classList.remove('selected-lang-item');
                if (a.getAttribute('data-lang') === lang) {
                    a.classList.add('selected-lang-item');
                }
            });
        }

        // Renderizar/Actualizar la lista de temas de comunidad si estamos en esa página
        if (filename === "comunidad.html") {
            const topicsListEl = document.getElementById('topicsList');
            if (topicsListEl) {
                renderAllTopics(topicsListEl, lang);
            }
        }
    }

    function setLanguage(lang) {
        applyTranslations(lang); // applyTranslations ahora se encarga de re-renderizar los temas
        localStorage.setItem('selectedLanguage', lang);
    }

    function applyInitialLanguage() {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        setLanguage(savedLanguage || 'es');
    }

    function initializeNavbarScripts() {
        const languageSelectorDropdown = document.getElementById('languageDropdownHeader');
        if (languageSelectorDropdown) {
            languageSelectorDropdown.addEventListener('click', (event) => {
                if (event.target.tagName === 'A' && event.target.dataset.lang) {
                    event.preventDefault();
                    const lang = event.target.dataset.lang;
                    setLanguage(lang);
                }
            });
        }
    }
    function initializeLoginModalScripts() {
        const openLoginModalBtn = document.getElementById('openLoginModalBtnHeader');
        const closeLoginModalBtn = document.getElementById('closeLoginModalBtn');
        const loginModalOverlay = document.getElementById('loginModalOverlay');
        const loginForm = document.getElementById('loginForm');
        if (openLoginModalBtn && loginModalOverlay) { openLoginModalBtn.addEventListener('click', () => { loginModalOverlay.classList.add('active'); }); }
        if (closeLoginModalBtn && loginModalOverlay) { closeLoginModalBtn.addEventListener('click', () => { loginModalOverlay.classList.remove('active'); }); }
        if (loginModalOverlay) { loginModalOverlay.addEventListener('click', (event) => { if (event.target === loginModalOverlay) { loginModalOverlay.classList.remove('active'); } }); }
        if (loginForm) { loginForm.addEventListener('submit', (event) => { event.preventDefault(); alert('Intento de inicio de sesión (simulado).'); loginModalOverlay.classList.remove('active'); }); }
    }
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const navLinks = document.querySelectorAll('#navbar-placeholder nav ul li a');
        navLinks.forEach(link => {
            const linkPage = (link.getAttribute('href') || "").split("/").pop();
            link.classList.remove('active');
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });
    }
    function initializeAOS() { AOS.init({ duration: 800, once: true, offset: 100 }); }

    function initializeHeroSearchTabs() {
        const searchTabsButtons = document.querySelectorAll('main .search-tabs .tab-btn');
        const searchMainInput = document.getElementById('search-main');
        if (searchTabsButtons.length > 0 && searchMainInput) {
            searchTabsButtons.forEach(tab => {
                tab.addEventListener('click', () => {
                    searchTabsButtons.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    const currentLang = localStorage.getItem('selectedLanguage') || 'es';
                    const placeholderKey = `data-placeholder-${currentLang}`;
                    if (tab.hasAttribute(placeholderKey)) {
                        searchMainInput.placeholder = tab.getAttribute(placeholderKey);
                    } else {
                        searchMainInput.placeholder = searchMainInput.getAttribute('placeholder');
                    }
                });
            });
        }
    }

    // --- LÓGICA ESPECÍFICA PARA COMUNIDAD.HTML (APARTE DE LA TRADUCCIÓN DE LA LISTA) ---
    function initializeCommunityPageScripts() {
        // Si tienes otra lógica específica para la página de comunidad que no sea
        // la renderización de la lista de temas (porque eso ya lo maneja applyTranslations),
        // la pones aquí. Por ejemplo, manejo de eventos de clic en los temas, etc.
        // Por ahora, puede estar casi vacía si solo se trataba de renderizar la lista.
        console.log("Scripts específicos de la página de comunidad (adicionales) inicializados.");
    }


    // --- EJECUTAR TODO ---
    loadAllSharedComponents();
});