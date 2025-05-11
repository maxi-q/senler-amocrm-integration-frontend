const AmoCRMProfile = ({amoCrmDomainName}: {amoCrmDomainName: string}) => {
  return (
    <div className="flex justify-start p-3 flex-row">
      <div className="flex w-full items-center text-sm justify-between">
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12">
          <img
            src="path/to/avatar.jpg"
            alt="Profile photo"
            className="w-full h-full rounded-full object-cover border-2 border-gray-200"
          />
          <div className="absolute inset-0 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
        </div>

        <div className="flex-1 text-left">
          <p className="font-medium">Аккаунт в amoCRM</p>
          <p className="text-gray-600">{amoCrmDomainName || 'account.amocrm.ru'}</p>
        </div>
      </div>
        <button className="text-red-600 font-medium rounded-md px-4 py-2 border border-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer">
          Отключить
        </button>
      </div>
    </div>
  )
}

export default AmoCRMProfile
