const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pageSections = document.querySelectorAll('[data-section]');

function setActiveSection(sectionId) {
	navigationLinks.forEach((link) => {
		const isActive = link.dataset.navLink === sectionId;
		link.classList.toggle('border-b-2', isActive);
		link.classList.toggle('border-primary', isActive);
		link.classList.toggle('text-primary', isActive);
		link.classList.toggle('font-bold', isActive);
		link.classList.toggle('opacity-80', isActive);
		link.classList.toggle('text-on-surface-variant', !isActive);
	});
}

navigationLinks.forEach((link) => {
	link.addEventListener('click', () => setActiveSection(link.dataset.navLink));
});

const sectionObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			setActiveSection(entry.target.dataset.section);
		}
	});
}, { rootMargin: '-25% 0px -60% 0px' });

pageSections.forEach((section) => sectionObserver.observe(section));
