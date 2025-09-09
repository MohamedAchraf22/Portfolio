document.addEventListener('DOMContentLoaded', function(){
	// Set current year
	const yearEl = document.getElementById('year');
	if(yearEl) yearEl.textContent = new Date().getFullYear();

	// Mobile nav toggle
	const navToggle = document.querySelector('.nav-toggle');
	const siteNav = document.getElementById('site-nav');
	if(navToggle && siteNav){
		navToggle.addEventListener('click', function(){
			const expanded = this.getAttribute('aria-expanded') === 'true';
			this.setAttribute('aria-expanded', String(!expanded));
			const hidden = siteNav.getAttribute('aria-hidden') === 'true';
			siteNav.setAttribute('aria-hidden', String(!hidden));
		});
	}

	// Basic contact form feedback (no network)
	const form = document.querySelector('.contact-form');
	if(form){
		form.addEventListener('submit', function(e){
			e.preventDefault();
			const btn = form.querySelector('button[type="submit"]');
			if(btn){
				const original = btn.textContent;
				btn.textContent = 'Sent (demo)';
				btn.disabled = true;
				setTimeout(()=>{ btn.textContent = original; btn.disabled = false; }, 2000);
			}
		});
	}

		// Reveal on scroll using IntersectionObserver
		const revealEls = document.querySelectorAll('.reveal');
		if('IntersectionObserver' in window && revealEls.length){
			const io = new IntersectionObserver((entries)=>{
				entries.forEach(entry=>{
					if(entry.isIntersecting){
						entry.target.classList.add('is-visible');
						io.unobserve(entry.target);
					}
				});
			},{threshold:0.12});
			revealEls.forEach(el=>io.observe(el));
		} else {
			// fallback: reveal all
			revealEls.forEach(el=>el.classList.add('is-visible'));
		}

		// Smooth-scroll enhancement for internal links (fallback handled by CSS)
		document.querySelectorAll('a[href^="#"]').forEach(a=>{
			a.addEventListener('click', function(e){
				const href = this.getAttribute('href');
				if(href.length>1){
					const target = document.querySelector(href);
					if(target){
						e.preventDefault();
						target.scrollIntoView({behavior:'smooth',block:'start'});
					}
				}
			});
		});

			// Avatar initials fallback
			const avatar = document.querySelector('.avatar');
			if(avatar){
				const img = avatar.querySelector('.avatar-img');
				const fallback = avatar.querySelector('.avatar-fallback');
				// compute initials from brand text
				const brand = document.querySelector('.brand')?.textContent?.trim() || 'You';
				const initials = brand.split(/\s+/).slice(0,2).map(w=>w[0]?.toUpperCase()||'').join('') || 'YU';
				if(fallback) fallback.textContent = initials;

					if(img){
						// show fallback only on error
						img.addEventListener('error', ()=>{ if(fallback) fallback.classList.add('show'); img.style.display = 'none'; });
						img.addEventListener('load', ()=>{ if(fallback) fallback.classList.remove('show'); img.style.display = ''; });
						// if image already broken
						if(img.complete && img.naturalWidth > 0){ if(fallback) fallback.classList.remove('show'); img.style.display = ''; }
						else if(img.complete && img.naturalWidth === 0){ if(fallback) fallback.classList.add('show'); img.style.display = 'none'; }
					}
			}

						// Scrollspy: distance-based active section detection (robust)
						const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
						const sections = Array.from(document.querySelectorAll('main section[id]'));
							let rafId = null;
								const getActiveByMidpoint = ()=>{
									const viewportMid = window.innerHeight * 0.5; // midpoint
									// first try: section that contains the midpoint
									for(const s of sections){
										const rect = s.getBoundingClientRect();
										if(rect.top <= viewportMid && rect.bottom >= viewportMid) return s.id;
									}
									// fallback: nearest top
									let closest = null; let minDist = Infinity;
									sections.forEach(s=>{
										const rect = s.getBoundingClientRect();
										const dist = Math.abs(rect.top - viewportMid);
										if(dist < minDist){ minDist = dist; closest = s.id; }
									});
									return closest;
								};
							const updateActive = ()=>{
								const active = getActiveByMidpoint();
								if(active){ navLinks.forEach(a=> a.classList.toggle('active', a.getAttribute('href') === `#${active}`)); }
								rafId = null;
							};
							const schedule = ()=>{ if(rafId==null) rafId = requestAnimationFrame(updateActive); };
							document.addEventListener('scroll', schedule, {passive:true});
							window.addEventListener('resize', schedule);
							// run once
							schedule();

						// close mobile nav on link click and set active immediately
						navLinks.forEach(a=>{
							a.addEventListener('click', function(){
								navLinks.forEach(x=>x.classList.toggle('active', x===this));
								if(siteNav && window.innerWidth <= 720) siteNav.setAttribute('aria-hidden','true');
							});
						});

					// Header pinned when scrolling past hero
					const header = document.querySelector('.site-header');
					const hero = document.querySelector('.hero');
					if(header && hero){
						const heroBottom = ()=> hero.getBoundingClientRect().bottom <= 16;
						const onScroll = ()=> header.classList.toggle('pinned', heroBottom());
						document.addEventListener('scroll', onScroll, {passive:true});
						// also pin on hover
						header.addEventListener('mouseenter', ()=> header.classList.add('pinned'));
						header.addEventListener('mouseleave', ()=> { if(!heroBottom()) header.classList.remove('pinned'); });
						// initial state
						onScroll();
					}

				// Prevent content hiding behind sticky header: add top padding to main equal to header height
				const mainEl = document.querySelector('main');
				const adjustMainPadding = ()=>{
					const h = document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
					if(mainEl) mainEl.style.paddingTop = h + 'px';
				};
				window.addEventListener('resize', adjustMainPadding);
				adjustMainPadding();

				// Hero entrance animation once layout is stable
				const heroSection = document.querySelector('#home .hero-inner');
				if(heroSection){
					requestAnimationFrame(()=>{
						const parent = document.querySelector('#home');
						if(parent){
							parent.classList.add('hero-animate');
							// Remove the class after the animation so hover transforms can apply
							setTimeout(()=> parent.classList.remove('hero-animate'), 900);
						}
					});
				}

				// Staggered reveal for common lists/grids
				const staggerContainers = document.querySelectorAll('.skills-groups, .projects-grid, .contact-links');
				staggerContainers.forEach((container)=>{
					Array.from(container.children).forEach((child, idx)=> child.style.setProperty('--i', idx));
					container.classList.add('stagger');
				});
				if('IntersectionObserver' in window && staggerContainers.length){
					const sio = new IntersectionObserver((entries)=>{
						entries.forEach(entry=>{
							if(entry.isIntersecting){
								entry.target.classList.add('in-view');
								sio.unobserve(entry.target);
							}
						});
					},{threshold:0.08});
					staggerContainers.forEach(el=>sio.observe(el));
				}
});
